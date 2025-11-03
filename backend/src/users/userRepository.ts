import { Prisma, User } from "@prisma/client";
import { prisma } from "src/common/prismaClient";
import { IUserRepository } from "./userInterfaces";

export class PrismaUserRepository implements IUserRepository {
    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({
            data,
        })

        return user;
    }

    async findByUsername(username: string) {
        const user = await prisma.user.findUnique({
            where: {
                username,
            }
        })

        return user;
    }

    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        })

        return user;
    }

    async findUserById(id: string) {
        const user = await prisma.user.findFirst({
            where: {
                id,
            }
        })

        return user;
    }

    async findAllUsers() {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                created_at: true,
                role: true,
                profile_pic: true
            }
        })

        return users;
    }

    async updateUserById(id: string, data: Partial<User>) {
        const user = await prisma.user.update({
            where: { id },
            data,
        })

        return user;
    }

    async deleteUserById(id: string) {
        await prisma.user.delete({
            where: { id }
        });
    }
}