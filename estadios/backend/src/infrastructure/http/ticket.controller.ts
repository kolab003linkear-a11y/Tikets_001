import { Request, Response } from 'express';
import { PurchaseService, TicketService, TicketTransferService } from '../../application/ticket.service';

const purchaseService = new PurchaseService();
const ticketService = new TicketService();
const ticketTransferService = new TicketTransferService();

export class PurchaseController {
  static async create(req: Request, res: Response) {
    try {
      const { userId, matchId, seatIds } = req.body;
      const purchase = await purchaseService.create(userId, matchId, seatIds);
      return res.status(201).json(purchase);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al procesar la compra' });
    }
  }

  static async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const purchases = await purchaseService.getByUser(userId);
      return res.status(200).json(purchases);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener las compras' });
    }
  }
}

export class TicketController {
  static async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const tickets = await ticketService.getByUser(userId);
      return res.status(200).json(tickets);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener los tickets' });
    }
  }

  static async getByQrCode(req: Request, res: Response) {
    try {
      const { qrCode } = req.params;
      const ticket = await ticketService.getByQrCode(qrCode);
      if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });
      return res.status(200).json(ticket);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener el ticket' });
    }
  }

  static async validate(req: Request, res: Response) {
    try {
      const { qrCode } = req.params;
      const ticket = await ticketService.validate(qrCode);
      return res.status(200).json({ message: 'Ticket válido, acceso permitido', ticket });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al validar el ticket' });
    }
  }
}

export class TicketTransferController {
  static async create(req: Request, res: Response) {
    try {
      const { ticketId, fromUserId, toUserId } = req.body;
      const transfer = await ticketTransferService.create(ticketId, fromUserId, toUserId);
      return res.status(201).json(transfer);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear la transferencia' });
    }
  }

  static async accept(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transfer = await ticketTransferService.accept(id);
      return res.status(200).json(transfer);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al aceptar la transferencia' });
    }
  }

  static async reject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transfer = await ticketTransferService.reject(id);
      return res.status(200).json(transfer);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al rechazar la transferencia' });
    }
  }
}
