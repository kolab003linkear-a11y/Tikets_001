import { prisma } from '../infrastructure/db/prisma.client';
import { SupportTicket, SupportTicketProps, TicketRequest, TicketRequestProps } from '../domain/support.entity';

export class SupportTicketService {
  async getAll(status?: SupportTicketProps['status']): Promise<SupportTicket[]> {
    const tickets = await prisma.supportTicket.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return tickets.map((t) => new SupportTicket(t));
  }

  async getByUser(userId: string): Promise<SupportTicket[]> {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return tickets.map((t) => new SupportTicket(t));
  }

  async getById(id: string): Promise<SupportTicket | null> {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: { requests: true },
    });
    if (!ticket) return null;
    return new SupportTicket(ticket);
  }

  async create(data: {
    userId: string;
    subject: string;
    description: string;
    priority?: SupportTicketProps['priority'];
  }): Promise<SupportTicket> {
    if (!data.userId || !data.subject || !data.description) {
      throw new Error('Usuario, asunto y descripción son obligatorios');
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: data.userId,
        subject: data.subject,
        description: data.description,
        priority: data.priority ?? 'MEDIUM',
      },
    });

    return new SupportTicket(ticket);
  }

  async updateStatus(id: string, status: SupportTicketProps['status']): Promise<SupportTicket> {
    const ticket = await prisma.supportTicket.update({ where: { id }, data: { status } });
    return new SupportTicket(ticket);
  }
}

export class TicketRequestService {
  async create(data: {
    supportTicketId: string;
    ticketId?: string;
    type: TicketRequestProps['type'];
  }): Promise<TicketRequest> {
    if (!data.supportTicketId || !data.type) {
      throw new Error('El ticket de soporte y el tipo de solicitud son obligatorios');
    }

    const request = await prisma.ticketRequest.create({
      data: {
        supportTicketId: data.supportTicketId,
        ticketId: data.ticketId,
        type: data.type,
      },
    });

    return new TicketRequest(request);
  }

  async updateStatus(id: string, status: TicketRequestProps['status']): Promise<TicketRequest> {
    const request = await prisma.ticketRequest.update({ where: { id }, data: { status } });

    // Si se aprueba un reembolso, marcamos el ticket original como cancelado
    if (status === 'APPROVED' && request.ticketId && request.type === 'REFUND') {
      await prisma.ticket.update({
        where: { id: request.ticketId },
        data: { status: 'CANCELED' },
      });
    }

    return new TicketRequest(request);
  }

  async getBySupportTicket(supportTicketId: string): Promise<TicketRequest[]> {
    const requests = await prisma.ticketRequest.findMany({
      where: { supportTicketId },
      orderBy: { createdAt: 'desc' },
    });
    return requests.map((r) => new TicketRequest(r));
  }
}
