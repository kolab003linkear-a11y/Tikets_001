import { prisma } from '../infrastructure/db/prisma.client.js';
import { EventEntity } from '../domain/event.entity.js';

export class EventService {
  static async getAllEvents(): Promise<EventEntity[]> {
    const events = await prisma.event.findMany({
      include: {
        stadium: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    return events.map((e: any) => new EventEntity({
      ...e,
      description: e.description ?? undefined,
    }));
  }

  static async getEventById(id: string): Promise<EventEntity | null> {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        stadium: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });

    if (!event) return null;
    return new EventEntity({
      ...event,
      description: event.description ?? undefined,
    });
  }

  static async createEvent(data: {
    title: string;
    date: Date | string;
    stadiumId: string;
    price?: number;
    totalTickets?: number;
    description?: string;
  }): Promise<EventEntity> {
    const stadiumExists = await prisma.stadium.findUnique({
      where: { id: data.stadiumId },
    });

    if (!stadiumExists) {
      throw new Error('El estadio especificado no existe');
    }

    const newEvent = await prisma.event.create({
      data: {
        title: data.title,
        date: new Date(data.date),
        stadiumId: data.stadiumId,
        price: data.price ? Number(data.price) : 0,
        totalTickets: data.totalTickets ? Number(data.totalTickets) : 0,
        description: data.description || null,
      },
      include: {
        stadium: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });

    return new EventEntity({
      ...newEvent,
      description: newEvent.description ?? undefined,
    });
  }

  static async deleteEvent(id: string): Promise<void> {
    const eventExists = await prisma.event.findUnique({
      where: { id },
    });

    if (!eventExists) {
      throw new Error('El evento no existe');
    }

    await prisma.event.delete({
      where: { id },
    });
  }
}
