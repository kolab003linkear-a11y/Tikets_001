import { Request, Response } from 'express';
import { EventService } from '../../application/event.service.js';

export class EventController {
  static async getEvents(_req: Request, res: Response) {
    try {
      const events = await EventService.getAllEvents();
      return res.json(events);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener eventos' });
    }
  }

  static async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }
      return res.json(event);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener el evento' });
    }
  }

  static async createEvent(req: Request, res: Response) {
    try {
      const { title, date, stadiumId, price, totalTickets, description } = req.body;
      if (!title || !date || !stadiumId) {
        return res.status(400).json({ message: 'Título, fecha y estadio son requeridos' });
      }
      const newEvent = await EventService.createEvent({
        title,
        date,
        stadiumId,
        price,
        totalTickets,
        description,
      });
      return res.status(201).json(newEvent);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear el evento' });
    }
  }

  static async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await EventService.deleteEvent(id);
      return res.status(200).json({ message: 'Evento eliminado correctamente' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al eliminar el evento' });
    }
  }
}