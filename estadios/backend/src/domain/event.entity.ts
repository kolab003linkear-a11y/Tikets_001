export interface EventProps {
  id?: string;
  title: string;
  date: Date | string;
  stadiumId: string;
  price?: number;
  totalTickets?: number;
  description?: string;
  stadium?: {
    id?: string;
    name: string;
    city: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export class EventEntity {
  public id?: string;
  public title: string;
  public date: Date;
  public stadiumId: string;
  public price: number;
  public totalTickets: number;
  public description?: string;
  public stadium?: {
    id?: string;
    name: string;
    city: string;
  };
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: EventProps) {
    this.id = props.id;
    this.title = props.title;
    this.date = typeof props.date === 'string' ? new Date(props.date) : props.date;
    this.stadiumId = props.stadiumId;
    this.price = props.price ?? 0;
    this.totalTickets = props.totalTickets ?? 0;
    this.description = props.description;
    this.stadium = props.stadium;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}