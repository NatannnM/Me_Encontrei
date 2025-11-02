import { EventsOnUsers, Role, Visibility } from "@prisma/client";
import { IEventsOnUsersService } from "./eventsOnUsersInterfaces";
import { PrismaEventsOnUsersRepository } from "./eventsOnUsersRepository";
import { createEventsOnUsersInput } from "./eventsOnUsersSchema";
import { prisma } from "src/common/prismaClient";
import { Decimal } from "@prisma/client/runtime/library";
import { AppError } from "src/common/AppError";
import { fileTypeFromBuffer } from "file-type";

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
    photo: string | null; 
    id_facility: string;
}

interface UserData {
    id: string;
    username: string;
    email: string;
    created_at: Date;
    profile_pic: string | null;
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

    async getEventsOnUsersByUserId(id_user: string): Promise<EventOnUsersData[] | null> {
        const eventOnUsers = await this.eventsOnUsersRepository.findEventsOnUsersByUserId(id_user);

        if(!eventOnUsers){
            throw new AppError('EventsOnUsers not found', 404, {
                isOperational: true,
                code: 'EVENTSONUSERS_NOT_FOUND',
                details: 'EventsOnUsers was not found',
            });
        }

        const eventOnUsersComBase64 = await Promise.all(
            eventOnUsers.map(async(event) => {
                const photo = event.event.photo;
                let dataUri = null;
                        
                if(photo){
                    const buffer = Buffer.from(photo);

                    const fileType = await fileTypeFromBuffer(buffer);

                    if (!fileType) {
                        throw new AppError('Tipo de imagem não reconhecido', 400);
                    }

                    const base64 = buffer.toString('base64');
                    dataUri = `data:${fileType.mime};base64,${base64}`;
                }
        
                        
                        return {
                            ...event,
                            event: {
                                ...event.event,
                                photo:dataUri,
                            },
                        };
                    })
                )
                return eventOnUsersComBase64;
    }

    async getEventsOnUsersByEventId(id_event: string): Promise<EventOnUsersDataUser[] | null> {
        const eventOnUsers = await this.eventsOnUsersRepository.findEventsOnUsersByEventId(id_event);
        
        if (!eventOnUsers) {
            throw new AppError('EventsOnUsers not found', 404, {
                isOperational: true,
                code: 'EVENTSONUSERS_NOT_FOUND',
                details: 'EventsOnUsers was not found',
            });
        }

        const eventOnUsersComBase64 = await Promise.all(
            eventOnUsers.map(async(users) => {
                const photo = users.user.profile_pic;
                let dataUri = null;
                
                if(photo){
                    const buffer = Buffer.from(photo);

                    const fileType = await fileTypeFromBuffer(buffer);

                    if (!fileType) {
                        throw new AppError('Tipo de imagem não reconhecido', 400);
                    }

                    const base64 = buffer.toString('base64');
                    dataUri = `data:${fileType.mime};base64,${base64}`;
                }

                
                return {
                    ...users,
                    user: {
                        ...users.user,
                        profile_pic:dataUri,
                    },
                };
            })
        )
        return eventOnUsersComBase64;

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