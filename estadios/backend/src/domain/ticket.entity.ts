export type TicketStatus = 'VALID' | 'USED' | 'TRANSFERRED' | 'CANCELED';
export type TransferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED';

export interface PurchaseProps {
  id?: string;
  userId: string;
  matchId: string;
  totalAmount: number;
  match?: { id?: string; date: Date; homeTeam?: string; awayTeam?: string };
  createdAt?: Date;
}

export class Purchase {
  public id?: string;
  public userId: string;
  public matchId: string;
  public totalAmount: number;
  public match?: { id?: string; date: Date; homeTeam?: string; awayTeam?: string };
  public createdAt?: Date;

  constructor(props: PurchaseProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.matchId = props.matchId;
    this.totalAmount = props.totalAmount;
    this.match = props.match;
    this.createdAt = props.createdAt;
  }
}

export interface TicketProps {
  id?: string;
  purchaseId: string;
  seatId: string;
  qrCode: string;
  status?: TicketStatus;
  seat?: { id?: string; row: string; number: number };
  createdAt?: Date;
}

export class Ticket {
  public id?: string;
  public purchaseId: string;
  public seatId: string;
  public qrCode: string;
  public status: TicketStatus;
  public seat?: { id?: string; row: string; number: number };
  public createdAt?: Date;

  constructor(props: TicketProps) {
    this.id = props.id;
    this.purchaseId = props.purchaseId;
    this.seatId = props.seatId;
    this.qrCode = props.qrCode;
    this.status = props.status ?? 'VALID';
    this.seat = props.seat;
    this.createdAt = props.createdAt;
  }
}

export interface TicketTransferProps {
  id?: string;
  ticketId: string;
  fromUserId: string;
  toUserId: string;
  status?: TransferStatus;
  createdAt?: Date;
}

export class TicketTransfer {
  public id?: string;
  public ticketId: string;
  public fromUserId: string;
  public toUserId: string;
  public status: TransferStatus;
  public createdAt?: Date;

  constructor(props: TicketTransferProps) {
    this.id = props.id;
    this.ticketId = props.ticketId;
    this.fromUserId = props.fromUserId;
    this.toUserId = props.toUserId;
    this.status = props.status ?? 'PENDING';
    this.createdAt = props.createdAt;
  }
}
