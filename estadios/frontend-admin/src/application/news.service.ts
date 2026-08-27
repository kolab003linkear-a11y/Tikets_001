import { ApiClient } from '../infrastructure/http/api.client';

import {
    News,
    CreateNewsDto,
    UpdateNewsDto,
} from '../domain/news.entity';

export class NewsService {

    static async getNews(
        teamId?: string
    ): Promise<News[]> {

        const endpoint = teamId
            ? `/news?teamId=${encodeURIComponent(teamId)}`
            : '/news';

        return ApiClient.get<News[]>(endpoint);
    }

    static async getNewsById(
        id: string
    ): Promise<News> {

        return ApiClient.get<News>(
            `/news/${id}`
        );
    }

    static async createNews(
        data: CreateNewsDto
    ): Promise<News> {

        return ApiClient.post<News>(
            '/news',
            data
        );
    }

    static async updateNews(
        id: string,
        data: UpdateNewsDto
    ): Promise<News> {

        return ApiClient.put<News>(
            `/news/${id}`,
            data
        );
    }

    static async deleteNews(
        id: string
    ): Promise<{ message: string }> {

        return ApiClient.delete<{ message: string }>(
            `/news/${id}`
        );
    }
}