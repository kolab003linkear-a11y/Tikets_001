import { prisma } from '../infrastructure/db/prisma.client';
import { Sector, SectorProps, Seat, SeatProps, Match, MatchProps, MatchSectorPrice } from '../domain/match.entity';

export class SectorService {
  async getAllByStadium(stadiumId: string): Promise<Sector[]> {
    const sectors = await prisma.sector.findMany({
      where: { stadiumId },
      orderBy: { name: 'asc' },
    });
    return sectors.map((s) => new Sector(s));
  }

  async getById(id: string): Promise<Sector | null> {
    const sector = await prisma.sector.findUnique({ where: { id } });
    if (!sector) return null;
    return new Sector(sector);
  }

  async create(data: Omit<SectorProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sector> {
    if (!data.name || !data.stadiumId || data.capacity <= 0) {
      throw new Error('Nombre, estadio y capacidad (> 0) del sector son obligatorios');
    }

    const newSector = await prisma.sector.create({
      data: {
        name: data.name,
        capacity: Number(data.capacity),
        stadiumId: data.stadiumId,
      },
    });

    return new Sector(newSector);
  }

  async update(id: string, data: Partial<Omit<SectorProps, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Sector> {
    const updatedSector = await prisma.sector.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.capacity && { capacity: Number(data.capacity) }),
      },
    });

    return new Sector(updatedSector);
  }

  async delete(id: string): Promise<void> {
    await prisma.sector.delete({ where: { id } });
  }
}

export class SeatService {
  async getAllBySector(sectorId: string): Promise<Seat[]> {
    const seats = await prisma.seat.findMany({
      where: { sectorId },
      orderBy: [{ row: 'asc' }, { number: 'asc' }],
    });
    return seats.map((s) => new Seat(s));
  }

  async getById(id: string): Promise<Seat | null> {
    const seat = await prisma.seat.findUnique({ where: { id } });
    if (!seat) return null;
    return new Seat(seat);
  }

  async create(data: Omit<SeatProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<Seat> {
    if (!data.row || !data.number || !data.sectorId) {
      throw new Error('Fila, número y sector del asiento son obligatorios');
    }

    const newSeat = await prisma.seat.create({
      data: {
        row: data.row,
        number: Number(data.number),
        sectorId: data.sectorId,
      },
    });

    return new Seat(newSeat);
  }

  /** Crea varios asientos de una fila de golpe, ej. fila "A" del 1 al 20 */
  async createBulk(sectorId: string, row: string, fromNumber: number, toNumber: number): Promise<Seat[]> {
    if (fromNumber > toNumber) {
      throw new Error('El número inicial no puede ser mayor al número final');
    }

    const data = [];
    for (let n = fromNumber; n <= toNumber; n++) {
      data.push({ row, number: n, sectorId });
    }

    await prisma.seat.createMany({ data, skipDuplicates: true });
    return this.getAllBySector(sectorId);
  }

  async delete(id: string): Promise<void> {
    await prisma.seat.delete({ where: { id } });
  }
}

export class MatchService {
  async getAll(): Promise<Match[]> {
    const matches = await prisma.match.findMany({
      include: { homeTeam: true, awayTeam: true, stadium: true },
      orderBy: { date: 'asc' },
    });
    return matches.map((m) => new Match(m));
  }

  async getById(id: string): Promise<Match | null> {
    const match = await prisma.match.findUnique({
      where: { id },
      include: { homeTeam: true, awayTeam: true, stadium: true, sectorPrices: { include: { sector: true } } },
    });
    if (!match) return null;
    return new Match(match);
  }

  async create(data: Omit<MatchProps, 'id' | 'createdAt' | 'status' | 'homeTeam' | 'awayTeam' | 'stadium'>): Promise<Match> {
    if (!data.homeTeamId || !data.awayTeamId || !data.stadiumId || !data.date) {
      throw new Error('Equipo local, visitante, estadio y fecha son obligatorios');
    }
    if (data.homeTeamId === data.awayTeamId) {
      throw new Error('El equipo local y visitante no pueden ser el mismo');
    }

    const newMatch = await prisma.match.create({
      data: {
        homeTeamId: data.homeTeamId,
        awayTeamId: data.awayTeamId,
        stadiumId: data.stadiumId,
        date: typeof data.date === 'string' ? new Date(data.date) : data.date,
      },
      include: { homeTeam: true, awayTeam: true, stadium: true },
    });

    return new Match(newMatch);
  }

  async updateStatus(id: string, status: MatchProps['status']): Promise<Match> {
    const updatedMatch = await prisma.match.update({
      where: { id },
      data: { status },
      include: { homeTeam: true, awayTeam: true, stadium: true },
    });

    return new Match(updatedMatch);
  }

  async delete(id: string): Promise<void> {
    await prisma.match.delete({ where: { id } });
  }
}

export class MatchSectorPriceService {
  async getByMatch(matchId: string): Promise<MatchSectorPrice[]> {
    const prices = await prisma.matchSectorPrice.findMany({
      where: { matchId },
      include: { sector: true },
    });
    return prices.map((p) => new MatchSectorPrice(p));
  }

  /** Crea o actualiza el precio de un sector para un partido específico */
  async setPrice(matchId: string, sectorId: string, price: number): Promise<MatchSectorPrice> {
    if (price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    const upserted = await prisma.matchSectorPrice.upsert({
      where: { matchId_sectorId: { matchId, sectorId } },
      update: { price },
      create: { matchId, sectorId, price },
      include: { sector: true },
    });

    return new MatchSectorPrice(upserted);
  }

  async delete(id: string): Promise<void> {
    await prisma.matchSectorPrice.delete({ where: { id } });
  }
}
