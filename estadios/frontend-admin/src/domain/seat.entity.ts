export interface Seat {
    id: string;
    row: string;
    number: number;
    sectorId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateSeatDto {
    row: string;
    number: number;
    sectorId: string;
}

export interface CreateBulkSeatsDto {
    row: string;
    startNumber: number;
    endNumber: number;
}