import { prisma } from '../infrastructure/db/prisma.client';
import { Stadium, StadiumProps } from '../domain/stadium.entity';

export class StadiumService {
  async getAll(): Promise<Stadium[]> {
    const stadiums = await prisma.stadium.findMany({
      orderBy: { name: 'asc' },
    });
    return stadiums.map((s) => new Stadium(s));
  }

  async getAll(): Promise<Stadium[]> {
    const stadiums = await prisma.stadium.findMany({
      orderBy: { name: 'asc' },
    });

    return stadiums.map((s) => new Stadium(s));
  }

  async create(data: Omit<StadiumProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<Stadium> {
    if (data.capacity <= 0) {
      throw new Error('La capacidad del estadio debe ser mayor a 0');
    }

    const newStadium = await prisma.stadium.create({
      data: {
        name: data.name,
        city: data.city,
        capacity: Number(data.capacity),
      },
    });

    return new Stadium(newStadium);
  }

  async update(id: string, data: Partial<Omit<StadiumProps, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Stadium> {
    const updatedStadium = await prisma.stadium.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.city && { city: data.city }),
        ...(data.capacity && { capacity: Number(data.capacity) }),
      },
    });

    return new Stadium(updatedStadium);
  }

  async delete(id: string): Promise<void> {
    await prisma.stadium.delete({
      where: { id },
    });
  }
}