export interface Sector {

    id: string;

    name: string;

    capacity: number;

    stadiumId: string;

    createdAt?: string;

    updatedAt?: string;

}

export interface CreateSectorDto {

    name: string;

    capacity: number;

    stadiumId: string;

}

export interface UpdateSectorDto {

    name?: string;

    capacity?: number;

}