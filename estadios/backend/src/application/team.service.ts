import { prisma } from '../infrastructure/db/prisma.client';
import { Team, TeamProps, News, NewsProps } from '../domain/team.entity';

export class TeamService {
  async getAll(): Promise<Team[]> {
    const teams = await prisma.team.findMany({
      orderBy: { name: 'asc' },
    });
    return teams.map((t) => new Team(t));
  }

  async getById(id: string): Promise<Team | null> {
    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) return null;
    return new Team(team);
  }

  async create(data: Omit<TeamProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
    if (!data.name || !data.city) {
      throw new Error('El nombre y la ciudad del equipo son obligatorios');
    }

    const newTeam = await prisma.team.create({
      data: {
        name: data.name,
        city: data.city,
        logoUrl: data.logoUrl,
      },
    });

    return new Team(newTeam);
  }

  async update(id: string, data: Partial<Omit<TeamProps, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Team> {
    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.city && { city: data.city }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
      },
    });

    return new Team(updatedTeam);
  }

  async delete(id: string): Promise<void> {
    await prisma.team.delete({ where: { id } });
  }
}

export class NewsService {
  async getAll(teamId?: string): Promise<News[]> {
    const news = await prisma.news.findMany({
      where: teamId ? { teamId } : undefined,
      include: { team: true },
      orderBy: { publishedAt: 'desc' },
    });
    return news.map((n) => new News(n));
  }

  async getById(id: string): Promise<News | null> {
    const news = await prisma.news.findUnique({
      where: { id },
      include: { team: true },
    });
    if (!news) return null;
    return new News(news);
  }

  async create(data: Omit<NewsProps, 'id' | 'publishedAt' | 'team'>): Promise<News> {
    if (!data.title || !data.content) {
      throw new Error('El título y el contenido de la noticia son obligatorios');
    }

    const newNews = await prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        teamId: data.teamId,
      },
    });

    return new News(newNews);
  }

  async update(id: string, data: Partial<Omit<NewsProps, 'id' | 'publishedAt' | 'team'>>): Promise<News> {
    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.teamId !== undefined && { teamId: data.teamId }),
      },
    });

    return new News(updatedNews);
  }

  async delete(id: string): Promise<void> {
    await prisma.news.delete({ where: { id } });
  }
}
