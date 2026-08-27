import { ApiClient } from '../infrastructure/http/api.client';
import {
    Team,
    CreateTeamDto,
    UpdateTeamDto,
} from '../domain/team.entity';

export class TeamService {

    static async getTeams(): Promise<Team[]> {
        return ApiClient.get<Team[]>('/teams');
    }

    static async getTeamById(id: string): Promise<Team> {
        return ApiClient.get<Team>(`/teams/${id}`);
    }

    static async createTeam(data: CreateTeamDto): Promise<Team> {
        return ApiClient.post<Team>('/teams', data);
    }

    static async updateTeam(
        id: string,
        data: UpdateTeamDto
    ): Promise<Team> {
        return ApiClient.put<Team>(`/teams/${id}`, data);
    }

    static async deleteTeam(
        id: string
    ): Promise<{ message: string }> {
        return ApiClient.delete<{ message: string }>(
            `/teams/${id}`
        );
    }
}