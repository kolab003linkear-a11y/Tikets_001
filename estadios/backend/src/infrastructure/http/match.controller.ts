import { Request, Response } from 'express';
import { SectorService, SeatService, MatchService, MatchSectorPriceService } from '../../application/match.service';

const sectorService = new SectorService();
const seatService = new SeatService();
const matchService = new MatchService();
const matchSectorPriceService = new MatchSectorPriceService();

export class SectorController {
  static async getAllByStadium(req: Request, res: Response) {
    try {
      const { stadiumId } = req.params;
      const sectors = await sectorService.getAllByStadium(stadiumId);
      return res.status(200).json(sectors);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener sectores' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sector = await sectorService.getById(id);
      if (!sector) return res.status(404).json({ message: 'Sector no encontrado' });
      return res.status(200).json(sector);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener el sector' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, capacity, stadiumId } = req.body;
      const sector = await sectorService.create({ name, capacity, stadiumId });
      return res.status(201).json(sector);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear el sector' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sector = await sectorService.update(id, req.body);
      return res.status(200).json(sector);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al actualizar el sector' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await sectorService.delete(id);
      return res.status(200).json({ message: 'Sector eliminado correctamente' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al eliminar el sector' });
    }
  }
}

export class SeatController {
  static async getAllBySector(req: Request, res: Response) {
    try {
      const { sectorId } = req.params;
      const seats = await seatService.getAllBySector(sectorId);
      return res.status(200).json(seats);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener asientos' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { row, number, sectorId } = req.body;
      const seat = await seatService.create({ row, number, sectorId });
      return res.status(201).json(seat);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear el asiento' });
    }
  }

  static async createBulk(req: Request, res: Response) {
    try {
      const { sectorId } = req.params;
      const { row, fromNumber, toNumber } = req.body;
      const seats = await seatService.createBulk(sectorId, row, Number(fromNumber), Number(toNumber));
      return res.status(201).json(seats);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear los asientos' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await seatService.delete(id);
      return res.status(200).json({ message: 'Asiento eliminado correctamente' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al eliminar el asiento' });
    }
  }
}

export class MatchController {
  static async getAll(_req: Request, res: Response) {
    try {
      const matches = await matchService.getAll();
      return res.status(200).json(matches);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener partidos' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const match = await matchService.getById(id);
      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });
      return res.status(200).json(match);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener el partido' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { homeTeamId, awayTeamId, stadiumId, date } = req.body;
      const match = await matchService.create({ homeTeamId, awayTeamId, stadiumId, date });
      return res.status(201).json(match);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear el partido' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const match = await matchService.updateStatus(id, status);
      return res.status(200).json(match);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al actualizar el estado del partido' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await matchService.delete(id);
      return res.status(200).json({ message: 'Partido eliminado correctamente' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al eliminar el partido' });
    }
  }
}

export class MatchSectorPriceController {
  static async getByMatch(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      const prices = await matchSectorPriceService.getByMatch(matchId);
      return res.status(200).json(prices);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener los precios' });
    }
  }

  static async setPrice(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      const { sectorId, price } = req.body;
      const result = await matchSectorPriceService.setPrice(matchId, sectorId, Number(price));
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al definir el precio del sector' });
    }
  }
}
