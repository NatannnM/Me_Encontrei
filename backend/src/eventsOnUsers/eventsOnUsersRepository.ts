import { EventsOnUsers, Prisma, Role, Visibility } from "@prisma/client";
import { IEventsOnUsersRepository } from "./eventsOnUsersInterfaces";
import { prisma } from "src/common/prismaClient";
import { Decimal } from "@prisma/client/runtime/library";

interface EventData {
    id: string;
    owner: string;
    name: string;
    address:string;
    city:string
    info:string;
    begin_date: Date;
    end_date: Date;
    public: Visibility;
    price: Decimal;
    created_at: Date;
    photo: Uint8Array | null; 
    id_facility: string;
}

interface UserData {
    id: string;
    username: string;
    email: string;
    created_at: Date;
    profile_pic: Uint8Array | null;
    role: Role;
}

interface EventOnUsersData {
  id_user: string;
  id_event: string;
  creator: boolean;
  event: EventData; 
}

interface EventOnUsersDataUser {
  id_user: string;
  id_event: string;
  creator: boolean;
  user: UserData; 
}


export class PrismaEventsOnUsersRepository implements IEventsOnUsersRepository{
    async create(data: Prisma.EventsOnUsersCreateInput){
        const evt_users = await prisma.eventsOnUsers.create({
            data,
        })

        return evt_users;
    }

    async findEventsOnUsersByUserId(id_user: string): Promise<EventOnUsersData[] | null> {
        return prisma.eventsOnUsers.findMany({
            where: { id_user },
            include: { event:true }
        });        
    }

    async findEventsOnUsersByEventId(id_event: string): Promise<EventOnUsersDataUser[] | null> {
        return await prisma.eventsOnUsers.findMany({
            where: { 
                id_event: id_event, 
            },
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

    async deleteEventsOnUsersByFacilityId(id_facility: string): Promise<void> {
        const events = await prisma.event.findMany({
            where: {
                id_facility: id_facility
            },
            select: {
                id: true
            }
        });

        if(events.length > 0){
            const eventsIds = events.map(event => event.id);

            await prisma.eventsOnUsers.deleteMany({
                where: {
                    id_event: {
                        in: eventsIds
                    }
                }
            });
        }
    }
}