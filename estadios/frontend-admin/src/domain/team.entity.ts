export interface Team {
    id: string;
    name: string;
    city: string;
    logoUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateTeamDto {
    name: string;
    city: string;
    logoUrl?: string;
}

export interface UpdateTeamDto {
    name?: string;
    city?: string;
    logoUrl?: string;
}