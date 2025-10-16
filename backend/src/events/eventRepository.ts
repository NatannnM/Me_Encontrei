import { Event, Prisma } from "@prisma/client";
import { IEventRepository } from "./eventInterfaces";
import { prisma } from "src/common/prismaClient";

export class PrismaEventRepository implements IEventRepository {
    async create(data: Prisma.EventCreateInput) {
        const event = await prisma.event.create({
            data,
        })

        return event;
    }

    async findByName(name: string) {
        const event = await prisma.event.findFirst({
            where: {
                name,
            }
        })

        return event;
    }

    async findEventById(id: string) {
        const event = await prisma.event.findFirst({
            where: {
                id,
            }
        })

        return event;
    }

    async findAllEvents() {
        const events = await prisma.event.findMany({
            select: {
                id: true,
                owner: true,
                name: true,
                address: true,
                city: true,
                info: true,
                begin_date: true,
                end_date: true,
                public: true,
                price: true,
                created_at: true,
                id_facility: true,
                photo: true,
            }
        })
        return events;
    }

    async updateEventById(id: string, data: Partial<Event>) {
        const event = await prisma.event.update({
            where: { id },
            data,
        })

        return event;
    }

    async deleteEventById(id: string) {
        await prisma.event.delete({
            where: { id }
        });
    }
}