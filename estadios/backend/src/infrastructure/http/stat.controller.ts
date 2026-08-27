import { Request, Response } from 'express';
import { MatchStatService, ReminderService } from '../../application/stat.service';

const matchStatService = new MatchStatService();
const reminderService = new ReminderService();

export class MatchStatController {
  static async getByMatch(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      const stats = await matchStatService.getByMatch(matchId);
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener las estadísticas' });
    }
  }

  static async add(req: Request, res: Response) {
    try {
      const { matchId, teamId, statType, value, minute } = req.body;
      const stat = await matchStatService.add({ matchId, teamId, statType, value, minute });
      return res.status(201).json(stat);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al registrar la estadística' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await matchStatService.delete(id);
      return res.status(200).json({ message: 'Estadística eliminada correctamente' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al eliminar la estadística' });
    }
  }
}

export class ReminderController {
  static async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const reminders = await reminderService.getByUser(userId);
      return res.status(200).json(reminders);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener los recordatorios' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { userId, matchId, remindAt } = req.body;
      const reminder = await reminderService.create(userId, matchId, remindAt);
      return res.status(201).json(reminder);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear el recordatorio' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await reminderService.delete(id);
      return res.status(200).json({ message: 'Recordatorio eliminado correctamente' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al eliminar el recordatorio' });
    }
  }
}
