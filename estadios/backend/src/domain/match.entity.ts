export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELED' | 'POSTPONED';

export interface MatchProps {
  id?: string;
  homeTeamId: string;
  awayTeamId: string;
  stadiumId: string;
  date: Date | string;
  status?: MatchStatus;
  homeTeam?: { id?: string; name: string };
  awayTeam?: { id?: string; name: string };
  stadium?: { id?: string; name: string; city: string };
  createdAt?: Date;
}

export class Match {
  public id?: string;
  public homeTeamId: string;
  public awayTeamId: string;
  public stadiumId: string;
  public date: Date;
  public status: MatchStatus;
  public homeTeam?: { id?: string; name: string };
  public awayTeam?: { id?: string; name: string };
  public stadium?: { id?: string; name: string; city: string };
  public createdAt?: Date;

  constructor(props: MatchProps) {
    this.id = props.id;
    this.homeTeamId = props.homeTeamId;
    this.awayTeamId = props.awayTeamId;
    this.stadiumId = props.stadiumId;
    this.date = typeof props.date === 'string' ? new Date(props.date) : props.date;
    this.status = props.status ?? 'SCHEDULED';
    this.homeTeam = props.homeTeam;
    this.awayTeam = props.awayTeam;
    this.stadium = props.stadium;
    this.createdAt = props.createdAt;
  }
}

export interface SectorProps {
  id?: string;
  name: string;
  capacity: number;
  stadiumId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Sector {
  public id?: string;
  public name: string;
  public capacity: number;
  public stadiumId: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: SectorProps) {
    this.id = props.id;
    this.name = props.name;
    this.capacity = props.capacity;
    this.stadiumId = props.stadiumId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface SeatProps {
  id?: string;
  row: string;
  number: number;
  sectorId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Seat {
  public id?: string;
  public row: string;
  public number: number;
  public sectorId: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: SeatProps) {
    this.id = props.id;
    this.row = props.row;
    this.number = props.number;
    this.sectorId = props.sectorId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface MatchSectorPriceProps {
  id?: string;
  matchId: string;
  sectorId: string;
  price: number;
  sector?: { id?: string; name: string };
}

export class MatchSectorPrice {
  public id?: string;
  public matchId: string;
  public sectorId: string;
  public price: number;
  public sector?: { id?: string; name: string };

  constructor(props: MatchSectorPriceProps) {
    this.id = props.id;
    this.matchId = props.matchId;
    this.sectorId = props.sectorId;
    this.price = props.price;
    this.sector = props.sector;
  }
}
