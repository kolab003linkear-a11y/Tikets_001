import { ApiClient } from '../infrastructure/http/api.client';
import {
    Stadium,
    CreateStadiumDto,
    UpdateStadiumDto,
} from '../domain/stadium.entity';

export class StadiumService {

    static async getStadiums(): Promise<Stadium[]> {
        return ApiClient.get<Stadium[]>('/stadiums');
    }

    static async getStadiumById(id: string): Promise<Stadium> {
        return ApiClient.get<Stadium>(`/stadiums/${id}`);
    }

    static async createStadium(
        data: CreateStadiumDto
    ): Promise<Stadium> {
        return ApiClient.post<Stadium>(
            '/stadiums',
            data
        );
    }

    static async updateStadium(
        id: string,
        data: UpdateStadiumDto
    ): Promise<Stadium> {
        return ApiClient.put<Stadium>(
            `/stadiums/${id}`,
            data
        );
    }

    static async deleteStadium(
        id: string
    ): Promise<{ message: string }> {
        return ApiClient.delete<{ message: string }>(
            `/stadiums/${id}`
        );
    }
}