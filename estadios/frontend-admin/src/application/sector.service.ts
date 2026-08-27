import { ApiClient } from '../infrastructure/http/api.client';

import {
    Sector,
    CreateSectorDto,
    UpdateSectorDto,
} from '../domain/sector.entity';

export class SectorService {

    /**
     * Obtiene todos los sectores de un estadio.
     */
    static async getSectorsByStadium(
        stadiumId: string
    ): Promise<Sector[]> {

        return ApiClient.get<Sector[]>(
            `/stadiums/${stadiumId}/sectors`
        );
    }

    /**
     * Obtiene un sector por ID.
     */
    static async getSectorById(
        id: string
    ): Promise<Sector> {

        return ApiClient.get<Sector>(
            `/sectors/${id}`
        );
    }

    /**
     * Crea un sector.
     */
    static async createSector(
        data: CreateSectorDto
    ): Promise<Sector> {

        return ApiClient.post<Sector>(
            '/sectors',
            data
        );
    }

    /**
     * Actualiza un sector.
     */
    static async updateSector(
        id: string,
        data: UpdateSectorDto
    ): Promise<Sector> {

        return ApiClient.put<Sector>(
            `/sectors/${id}`,
            data
        );
    }

    /**
     * Elimina un sector.
     */
    static async deleteSector(
        id: string
    ): Promise<{ message: string }> {

        return ApiClient.delete<{ message: string }>(
            `/sectors/${id}`
        );
    }
}