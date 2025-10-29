import { FastifyReply, FastifyRequest } from "fastify";
import { createEventsOnUsersInput } from "./eventsOnUsersSchema";
import { EventsOnUsers, Prisma } from "@prisma/client";

//CONTROLLER
export interface IEventsOnUsersController{
    create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showAll(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showByUserId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showByEventId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    delete(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    deleteByUserId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    deleteByEventId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}

//SERVICE
export interface IEventsOnUsersService{
    createEventsOnUsers(data: createEventsOnUsersInput): Promise<EventsOnUsers>;
    getEventsOnUsersByUserId(id: string): Promise<EventsOnUsers[] | null>;
    getEventsOnUsersByEventId(id: string): Promise<EventsOnUsers[] | null>;
    getEventsOnUsers(): Promise<EventsOnUsers[]>;
    deleteEventsOnUsersByUserId(id: string): Promise<void>;
    deleteEventsOnUsersByEventId(id: string): Promise<void>;   
    deleteEventsOnUsers(id_user: String, id_event: string): Promise<void>
}

//REPOSITORY
export interface IEventsOnUsersRepository{
    create(data: Prisma.EventsOnUsersCreateInput): Promise<EventsOnUsers>;
    findEventsOnUsersByUserId(id: string): Promise<EventsOnUsers[] | null>;
    findEventsOnUsersByEventId(id: string): Promise<EventsOnUsers[] | null>;
    findAllEventsOnUsers(): Promise<EventsOnUsers[]>;
    deleteEventsOnUsers(id_user: string, id_event: string): Promise<void>;
    deleteEventsOnUsersByUserId(id: string,): Promise<void>;
    deleteEventsOnUsersByEventId(id: string,): Promise<void>;
}