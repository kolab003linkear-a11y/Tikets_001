export interface SectorPrice {
    id?: string;

    matchId: string;

    sectorId: string;

    price: number;

    sector?: {
        id?: string;
        name: string;
    };
}

export interface SetSectorPriceDto {
    sectorId: string;
    price: number;
}