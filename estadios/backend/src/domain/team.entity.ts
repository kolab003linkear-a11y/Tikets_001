export interface TeamProps {
  id?: string;
  name: string;
  city: string;
  logoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Team {
  public id?: string;
  public name: string;
  public city: string;
  public logoUrl?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: TeamProps) {
    this.id = props.id;
    this.name = props.name;
    this.city = props.city;
    this.logoUrl = props.logoUrl;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface NewsProps {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  teamId?: string;
  team?: {
    id?: string;
    name: string;
  };
  publishedAt?: Date | string;
}

export class News {
  public id?: string;
  public title: string;
  public content: string;
  public imageUrl?: string;
  public teamId?: string;
  public team?: {
    id?: string;
    name: string;
  };
  public publishedAt?: Date;

  constructor(props: NewsProps) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.imageUrl = props.imageUrl;
    this.teamId = props.teamId;
    this.team = props.team;
    this.publishedAt =
      typeof props.publishedAt === 'string' ? new Date(props.publishedAt) : props.publishedAt;
  }
}
