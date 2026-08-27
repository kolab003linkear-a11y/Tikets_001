export interface StadiumProps {
  id?: string;
  name: string;
  city: string;
  capacity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Stadium {
  public id?: string;
  public name: string;
  public city: string;
  public capacity: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: StadiumProps) {
    this.id = props.id;
    this.name = props.name;
    this.city = props.city;
    this.capacity = props.capacity;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}