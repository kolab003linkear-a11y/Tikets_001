export type SupportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type SupportPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type RequestType = 'REFUND' | 'EXCHANGE' | 'COMPLAINT' | 'OTHER';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SupportTicketProps {
  id?: string;
  userId: string;
  subject: string;
  description: string;
  status?: SupportStatus;
  priority?: SupportPriority;
  createdAt?: Date;
}

export class SupportTicket {
  public id?: string;
  public userId: string;
  public subject: string;
  public description: string;
  public status: SupportStatus;
  public priority: SupportPriority;
  public createdAt?: Date;

  constructor(props: SupportTicketProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.subject = props.subject;
    this.description = props.description;
    this.status = props.status ?? 'OPEN';
    this.priority = props.priority ?? 'MEDIUM';
    this.createdAt = props.createdAt;
  }
}

export interface TicketRequestProps {
  id?: string;
  supportTicketId: string;
  ticketId?: string;
  type: RequestType;
  status?: RequestStatus;
  createdAt?: Date;
}

export class TicketRequest {
  public id?: string;
  public supportTicketId: string;
  public ticketId?: string;
  public type: RequestType;
  public status: RequestStatus;
  public createdAt?: Date;

  constructor(props: TicketRequestProps) {
    this.id = props.id;
    this.supportTicketId = props.supportTicketId;
    this.ticketId = props.ticketId;
    this.type = props.type;
    this.status = props.status ?? 'PENDING';
    this.createdAt = props.createdAt;
  }
}
