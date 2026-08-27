import { PrismaClient } from '@prisma/client';

export class UserService {
    constructor(private prisma: PrismaClient) { }

    async getAllUsers() {
        return await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async getUserById(id: string) {
        return await this.prisma.user.findUnique({
            where: { id },
        });
    }
}