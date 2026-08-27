import { prisma } from '../infrastructure/db/prisma.client';
import { MatchStat, Reminder } from '../domain/stat.entity';

export class MatchStatService {
  async getByMatch(matchId: string): Promise<MatchStat[]> {
    const stats = await prisma.matchStat.findMany({
      where: { matchId },
      include: { team: true },
      orderBy: { minute: 'asc' },
    });
    return stats.map((s) => new MatchStat(s));
  }

  async add(data: { matchId: string; teamId: string; statType: string; value: number; minute?: number }): Promise<MatchStat> {
    if (!data.matchId || !data.teamId || !data.statType || data.value === undefined) {
      throw new Error('Partido, equipo, tipo de estadística y valor son obligatorios');
    }

    const stat = await prisma.matchStat.create({
      data: {
        matchId: data.matchId,
        teamId: data.teamId,
        statType: data.statType,
        value: data.value,
        minute: data.minute,
      },
      include: { team: true },
    });

    return new MatchStat(stat);
  }

  async delete(id: string): Promise<void> {
    await prisma.matchStat.delete({ where: { id } });
  }
}

export class ReminderService {
  async getByUser(userId: string): Promise<Reminder[]> {
    const reminders = await prisma.reminder.findMany({
      where: { userId },
      orderBy: { remindAt: 'asc' },
    });
    return reminders.map((r) => new Reminder(r));
  }

  async create(userId: string, matchId: string, remindAt: Date | string): Promise<Reminder> {
    if (!userId || !matchId || !remindAt) {
      throw new Error('Usuario, partido y fecha de recordatorio son obligatorios');
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId,
        matchId,
        remindAt: typeof remindAt === 'string' ? new Date(remindAt) : remindAt,
      },
    });

    return new Reminder(reminder);
  }

  /** Recordatorios pendientes de enviar (para un job/cron externo) */
  async getPending(): Promise<Reminder[]> {
    const reminders = await prisma.reminder.findMany({
      where: { sent: false, remindAt: { lte: new Date() } },
    });
    return reminders.map((r) => new Reminder(r));
  }

  async markSent(id: string): Promise<Reminder> {
    const reminder = await prisma.reminder.update({ where: { id }, data: { sent: true } });
    return new Reminder(reminder);
  }

  async delete(id: string): Promise<void> {
    await prisma.reminder.delete({ where: { id } });
  }
}
