export interface News {
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    teamId?: string | null;

    team?: {
        id?: string;
        name: string;
    } | null;

    publishedAt?: string | null;
}

export interface CreateNewsDto {
    title: string;
    content: string;
    imageUrl?: string;
    teamId?: string;
}

export interface UpdateNewsDto {
    title?: string;
    content?: string;
    imageUrl?: string;
    teamId?: string;
}