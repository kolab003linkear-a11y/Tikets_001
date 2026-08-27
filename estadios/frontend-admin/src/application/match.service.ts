import { ApiClient } from '../infrastructure/http/api.client';

import {
    Match,
    CreateMatchDto,
    UpdateMatchStatusDto,
    Team,
} from '../domain/match.entity';

export class MatchService {

    static async getMatches(): Promise<Match[]> {
        return ApiClient.get<Match[]>('/matches');
    }

    static async createMatch(
        data: CreateMatchDto
    ): Promise<Match> {

        return ApiClient.post<Match>(
            '/matches',
            data
        );
    }

    static async updateStatus(
        id: string,
        data: UpdateMatchStatusDto
    ): Promise<Match> {

        return ApiClient.patch<Match>(
            `/matches/${id}/status`,
            data
        );
    }

    static async deleteMatch(
        id: string
    ): Promise<{ message: string }> {

        return ApiClient.delete<{ message: string }>(
            `/matches/${id}`
        );
    }

    static async getTeams(): Promise<Team[]> {

        return ApiClient.get<Team[]>('/teams');
    }
}