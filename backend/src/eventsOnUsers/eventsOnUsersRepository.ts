import { EventsOnUsers, Prisma } from "@prisma/client";
import { IEventsOnUsersRepository } from "./eventsOnUsersInterfaces";
import { prisma } from "src/common/prismaClient";

export class PrismaEventsOnUsersRepository implements IEventsOnUsersRepository{
    async create(data: Prisma.EventsOnUsersCreateInput){
        const evt_users = await prisma.eventsOnUsers.create({
            data,
        })

        return evt_users;
    }

    async findEventsOnUsersByUserId(id_user: string): Promise<EventsOnUsers[] | null> {
        return prisma.eventsOnUsers.findMany({
            where: { id_user },
            include: { event:true }
        });        
    }

    async findEventsOnUsersByEventId(id_event: string): Promise<EventsOnUsers[] | null> {
        return prisma.eventsOnUsers.findMany({
            where: { id_event },
            include: { user:true }
        });        
    }

    async findAllEventsOnUsers(): Promise<EventsOnUsers[]> {
        return prisma.eventsOnUsers.findMany({
            include: { user: true, event: true}
        });
    }

    async deleteEventsOnUsers(id_user: string, id_event: string): Promise<void> {
        await prisma.eventsOnUsers.delete({
            where: {
                id_user_id_event: {
                    id_user,
                    id_event
                }
            }
        })
    }

    async deleteEventsOnUsersByUserId(id_user: string): Promise<void> {
        await prisma.eventsOnUsers.deleteMany({ where: {id_user}});        
    }

    async deleteEventsOnUsersByEventId(id_event: string): Promise<void> {
        await prisma.eventsOnUsers.deleteMany({ where: { id_event } })
    }
}