import { Request, Response } from 'express';
import { TeamService, NewsService } from '../../application/team.service';

const teamService = new TeamService();
const newsService = new NewsService();

export class TeamController {
  static async getAll(_req: Request, res: Response) {
    try {
      const teams = await teamService.getAll();
      return res.status(200).json(teams);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener equipos' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const team = await teamService.getById(id);

      if (!team) {
        return res.status(404).json({ message: 'Equipo no encontrado' });
      }

      return res.status(200).json(team);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener el equipo' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, city, logoUrl } = req.body;
      const team = await teamService.create({ name, city, logoUrl });
      return res.status(201).json(team);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear el equipo' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const team = await teamService.update(id, req.body);
      return res.status(200).json(team);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al actualizar el equipo' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await teamService.delete(id);
      return res.status(200).json({ message: 'Equipo eliminado correctamente' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al eliminar el equipo' });
    }
  }
}

export class NewsController {
  static async getAll(req: Request, res: Response) {
    try {
      const { teamId } = req.query;
      const news = await newsService.getAll(teamId as string | undefined);
      return res.status(200).json(news);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener noticias' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const news = await newsService.getById(id);

      if (!news) {
        return res.status(404).json({ message: 'Noticia no encontrada' });
      }

      return res.status(200).json(news);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener la noticia' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { title, content, imageUrl, teamId } = req.body;
      const news = await newsService.create({ title, content, imageUrl, teamId });
      return res.status(201).json(news);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear la noticia' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const news = await newsService.update(id, req.body);
      return res.status(200).json(news);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al actualizar la noticia' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await newsService.delete(id);
      return res.status(200).json({ message: 'Noticia eliminada correctamente' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al eliminar la noticia' });
    }
  }
}
