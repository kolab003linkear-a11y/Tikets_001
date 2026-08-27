import crypto from 'crypto';
import { prisma } from '../infrastructure/db/prisma.client';
import { Purchase, Ticket, TicketTransfer } from '../domain/ticket.entity';

export class PurchaseService {
  /**
   * Compra tickets para un partido: recibe una lista de seatId y calcula
   * el precio según el sector de cada asiento (MatchSectorPrice).
   */
  async create(userId: string, matchId: string, seatIds: string[]): Promise<Purchase> {
    if (!userId || !matchId || !seatIds?.length) {
      throw new Error('Usuario, partido y al menos un asiento son obligatorios');
    }

    const seats = await prisma.seat.findMany({
      where: { id: { in: seatIds } },
      include: { sector: true },
    });

    if (seats.length !== seatIds.length) {
      throw new Error('Uno o más asientos no existen');
    }

    const alreadyTaken = await prisma.ticket.findFirst({
      where: {
        seatId: { in: seatIds },
        status: { in: ['VALID', 'USED'] },
        purchase: { matchId },
      },
    });
    if (alreadyTaken) {
      throw new Error('Uno o más asientos ya fueron vendidos para este partido');
    }

    const sectorPrices = await prisma.matchSectorPrice.findMany({
      where: { matchId, sectorId: { in: seats.map((s) => s.sectorId) } },
    });
    const priceBySector = new Map(sectorPrices.map((p) => [p.sectorId, p.price]));

    let totalAmount = 0;
    for (const seat of seats) {
      const price = priceBySector.get(seat.sectorId);
      if (price === undefined) {
        throw new Error(`No se ha definido un precio para el sector "${seat.sector.name}" en este partido`);
      }
      totalAmount += price;
    }

    const purchase = await prisma.purchase.create({
      data: {
        userId,
        matchId,
        totalAmount,
        tickets: {
          create: seats.map((seat) => ({
            seatId: seat.id,
            qrCode: crypto.randomUUID(),
          })),
        },
      },
      include: { match: { include: { homeTeam: true, awayTeam: true } } },
    });

    return new Purchase(purchase);
  }

  async getByUser(userId: string): Promise<Purchase[]> {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: { match: { include: { homeTeam: true, awayTeam: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return purchases.map((p) => new Purchase(p));
  }
}

export class TicketService {
  async getByUser(userId: string): Promise<Ticket[]> {
    const tickets = await prisma.ticket.findMany({
      where: { purchase: { userId } },
      include: { seat: true },
      orderBy: { createdAt: 'desc' },
    });
    return tickets.map((t) => new Ticket(t));
  }

  async getByQrCode(qrCode: string): Promise<Ticket | null> {
    const ticket = await prisma.ticket.findUnique({
      where: { qrCode },
      include: { seat: true },
    });
    if (!ticket) return null;
    return new Ticket(ticket);
  }

  /** Usado por el validador en la puerta del estadio */
  async validate(qrCode: string): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({ where: { qrCode } });
    if (!ticket) {
      throw new Error('El ticket no existe');
    }
    if (ticket.status === 'USED') {
      throw new Error('Este ticket ya fue utilizado');
    }
    if (ticket.status !== 'VALID') {
      throw new Error(`El ticket no es válido (estado: ${ticket.status})`);
    }

    const updated = await prisma.ticket.update({
      where: { qrCode },
      data: { status: 'USED' },
      include: { seat: true },
    });

    return new Ticket(updated);
  }
}

export class TicketTransferService {
  async create(ticketId: string, fromUserId: string, toUserId: string): Promise<TicketTransfer> {
    if (fromUserId === toUserId) {
      throw new Error('No puedes transferirte un ticket a ti mismo');
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId }, include: { purchase: true } });
    if (!ticket) {
      throw new Error('El ticket no existe');
    }
    if (ticket.purchase.userId !== fromUserId) {
      throw new Error('Solo el dueño del ticket puede transferirlo');
    }
    if (ticket.status !== 'VALID') {
      throw new Error('Solo se pueden transferir tickets válidos (no usados)');
    }

    const transfer = await prisma.ticketTransfer.create({
      data: { ticketId, fromUserId, toUserId },
    });

    return new TicketTransfer(transfer);
  }

  async accept(id: string): Promise<TicketTransfer> {
    const transfer = await prisma.ticketTransfer.findUnique({ where: { id } });
    if (!transfer) throw new Error('La transferencia no existe');
    if (transfer.status !== 'PENDING') throw new Error('Esta transferencia ya fue resuelta');

    const [updatedTransfer] = await prisma.$transaction([
      prisma.ticketTransfer.update({ where: { id }, data: { status: 'ACCEPTED' } }),
      prisma.ticket.update({ where: { id: transfer.ticketId }, data: { status: 'TRANSFERRED' } }),
    ]);

    // Nota: el schema actual no guarda un "dueño actual" por ticket, solo el
    // userId de la Purchase original. Si necesitas reflejar al nuevo dueño
    // (toUserId) como propietario real, habría que agregar un campo tipo
    // `currentOwnerId` en Ticket — dime si lo agregamos.
    return new TicketTransfer(updatedTransfer);
  }

  async reject(id: string): Promise<TicketTransfer> {
    const updated = await prisma.ticketTransfer.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
    return new TicketTransfer(updated);
  }
}
