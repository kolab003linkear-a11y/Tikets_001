import { Request, Response } from 'express';
import { SupportTicketService, TicketRequestService } from '../../application/support.service';

const supportTicketService = new SupportTicketService();
const ticketRequestService = new TicketRequestService();

export class SupportTicketController {
  static async getAll(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const tickets = await supportTicketService.getAll(status as any);
      return res.status(200).json(tickets);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener los tickets de soporte' });
    }
  }

  static async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const tickets = await supportTicketService.getByUser(userId);
      return res.status(200).json(tickets);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener los tickets de soporte' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await supportTicketService.getById(id);
      if (!ticket) return res.status(404).json({ message: 'Ticket de soporte no encontrado' });
      return res.status(200).json(ticket);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener el ticket de soporte' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { userId, subject, description, priority } = req.body;
      const ticket = await supportTicketService.create({ userId, subject, description, priority });
      return res.status(201).json(ticket);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear el ticket de soporte' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const ticket = await supportTicketService.updateStatus(id, status);
      return res.status(200).json(ticket);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al actualizar el ticket de soporte' });
    }
  }
}

export class TicketRequestController {
  static async getBySupportTicket(req: Request, res: Response) {
    try {
      const { supportTicketId } = req.params;
      const requests = await ticketRequestService.getBySupportTicket(supportTicketId);
      return res.status(200).json(requests);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener las solicitudes' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { supportTicketId, ticketId, type } = req.body;
      const request = await ticketRequestService.create({ supportTicketId, ticketId, type });
      return res.status(201).json(request);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear la solicitud' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const request = await ticketRequestService.updateStatus(id, status);
      return res.status(200).json(request);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al actualizar la solicitud' });
    }
  }
}
