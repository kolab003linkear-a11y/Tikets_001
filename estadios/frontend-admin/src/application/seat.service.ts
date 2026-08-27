import { ApiClient } from '../infrastructure/http/api.client';

import {
    Seat,
    CreateSeatDto,
    CreateBulkSeatsDto,
} from '../domain/seat.entity';

export class SeatService {

    static async getBySector(
        sectorId: string
    ): Promise<Seat[]> {

        return ApiClient.get<Seat[]>(
            `/sectors/${sectorId}/seats`
        );
    }

    static async create(
        data: CreateSeatDto
    ): Promise<Seat> {

        return ApiClient.post<Seat>(
            '/seats',
            data
        );
    }

    static async createBulk(
        sectorId: string,
        data: CreateBulkSeatsDto
    ): Promise<Seat[]> {

        return ApiClient.post<Seat[]>(
            `/sectors/${sectorId}/seats/bulk`,
            data
        );
    }

    static async delete(
        id: string
    ): Promise<{ message: string }> {

        return ApiClient.delete<{ message: string }>(
            `/seats/${id}`
        );
    }
}
