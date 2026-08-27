export interface MatchStatProps {
  id?: string;
  matchId: string;
  teamId: string;
  statType: string;
  value: number;
  minute?: number;
  team?: { id?: string; name: string };
}

export class MatchStat {
  public id?: string;
  public matchId: string;
  public teamId: string;
  public statType: string;
  public value: number;
  public minute?: number;
  public team?: { id?: string; name: string };

  constructor(props: MatchStatProps) {
    this.id = props.id;
    this.matchId = props.matchId;
    this.teamId = props.teamId;
    this.statType = props.statType;
    this.value = props.value;
    this.minute = props.minute;
    this.team = props.team;
  }
}

export interface ReminderProps {
  id?: string;
  userId: string;
  matchId: string;
  remindAt: Date | string;
  sent?: boolean;
  createdAt?: Date;
}

export class Reminder {
  public id?: string;
  public userId: string;
  public matchId: string;
  public remindAt: Date;
  public sent: boolean;
  public createdAt?: Date;

  constructor(props: ReminderProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.matchId = props.matchId;
    this.remindAt = typeof props.remindAt === 'string' ? new Date(props.remindAt) : props.remindAt;
    this.sent = props.sent ?? false;
    this.createdAt = props.createdAt;
  }
}
