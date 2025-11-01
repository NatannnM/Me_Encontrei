import { EventsOnUsers } from "@prisma/client";
import { IEventsOnUsersService } from "./eventsOnUsersInterfaces";
import { PrismaEventsOnUsersRepository } from "./eventsOnUsersRepository";
import { createEventsOnUsersInput } from "./eventsOnUsersSchema";
import { prisma } from "src/common/prismaClient";

export class EventsOnUsersService implements IEventsOnUsersService{
    constructor (private readonly eventsOnUsersRepository = new PrismaEventsOnUsersRepository()){}

    async createEventsOnUsers(data: createEventsOnUsersInput): Promise<EventsOnUsers> {
        const {id_user, id_event, creator} = data;

        const user = await prisma.user.findUnique({
            where: { id: id_user}
        });

        const event = await prisma.event.findUnique({
            where: { id: id_event}
        });

        if(!user || !event){
            throw new Error('Usuário ou estabelecimento não encontrado');
        }

        const evt_user = await prisma.eventsOnUsers.create({
            data: {
                user: {
                    connect: {id: id_user}
                },
                event: {
                    connect: {id: id_event}
                },
                creator,
            }
        });

        return evt_user;
    }

    async getEventsOnUsersByUserId(id_user: string): Promise<EventsOnUsers[] | null> {
        return this.eventsOnUsersRepository.findEventsOnUsersByUserId(id_user);
    }

    async getEventsOnUsersByEventId(id_event: string): Promise<EventsOnUsers[] | null> {
        return this.eventsOnUsersRepository.findEventsOnUsersByEventId(id_event);
    }

    async getEventsOnUsers(): Promise<EventsOnUsers[]> {
        return this.eventsOnUsersRepository.findAllEventsOnUsers();
    }

    async deleteEventsOnUsersByUserId(id_user: string): Promise<void> {
        return this.eventsOnUsersRepository.deleteEventsOnUsersByUserId(id_user);
    }

    async deleteEventsOnUsersByEventId(id_event: string): Promise<void> {
        return this.eventsOnUsersRepository.deleteEventsOnUsersByEventId(id_event);
    }

    async deleteEventsOnUsers(id_user: string, id_event: string): Promise<void> {
        await this.eventsOnUsersRepository.deleteEventsOnUsers(id_user, id_event);
    }

    async deleteEventsOnUsersByFacilityId(id_facility: string): Promise<void> {
        await this.eventsOnUsersRepository.deleteEventsOnUsersByFacilityId(id_facility);
    }
}