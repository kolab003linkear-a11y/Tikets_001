export interface Stadium {
    id: string;
    name: string;
    city: string;
    capacity: number;
}

export interface CreateStadiumDto {
    name: string;
    city: string;
    capacity: number;
}

export interface UpdateStadiumDto {
    name?: string;
    city?: string;
    capacity?: number;
}