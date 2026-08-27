import { ApiClient } from '../infrastructure/http/api.client';

import {
    SectorPrice,
    SetSectorPriceDto,
} from '../domain/price.entity';


export class PriceService {

    /**
     * Obtiene todos los precios configurados
     * para un partido específico.
     */
    static async getPricesByMatch(
        matchId: string
    ): Promise<SectorPrice[]> {

        return ApiClient.get<SectorPrice[]>(
            `/matches/${matchId}/sector-prices`
        );
    }


    /**
     * Crea o actualiza el precio de un sector
     * para un partido específico.
     */
    static async setPrice(
        matchId: string,
        data: SetSectorPriceDto
    ): Promise<SectorPrice> {

        return ApiClient.post<SectorPrice>(
            `/matches/${matchId}/sector-prices`,
            data
        );
    }
}