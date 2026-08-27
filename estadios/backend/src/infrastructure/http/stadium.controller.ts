import { Request, Response } from 'express';
import { StadiumService } from '../../application/stadium.service';

const stadiumService = new StadiumService();

export class StadiumController {
  static async getAll(_req: Request, res: Response) {
    try {
      const stadiums = await stadiumService.getAll();
      return res.status(200).json(stadiums);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener estadios' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stadium = await stadiumService.getById(id);
      
      if (!stadium) {
        return res.status(404).json({ message: 'Estadio no encontrado' });
      }

      return res.status(200).json(stadium);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener el estadio' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, city, capacity } = req.body;

      if (!name || !city || !capacity) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios (name, city, capacity)' });
      }

      const stadium = await stadiumService.create({ name, city, capacity });
      return res.status(201).json(stadium);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear el estadio' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stadium = await stadiumService.update(id, req.body);
      return res.status(200).json(stadium);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al actualizar el estadio' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await stadiumService.delete(id);
      return res.status(200).json({ message: 'Estadio eliminado correctamente' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al eliminar el estadio' });
    }
  }
}