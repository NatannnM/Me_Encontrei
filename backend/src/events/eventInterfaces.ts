import { Event, Prisma, Visibility } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { createEventInput } from "./eventSchema";

//CONTROLLER
export interface IEventController {
    create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showAll(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showById(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    //update(_req: FastifyRequest<UpdateEventRequest>, reply: FastifyReply): Promise<FastifyReply>;
    delete(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}

export interface UpdateEventRequest extends RouteGenericInterface {
    Params: {id: string};
    Body: {
        owner?: string;
        name?: string;
        address?: string;
        city?: string;
        info?: string;
        begin_date?: Date;
        end_date?: Date;
        public?: Visibility;
        price?: Decimal;
        id_facility?: string;
        photo?: Buffer;
    }
}

export type UpdateEventData = Partial<Event>

export interface EventVisibility{
    visibility: 'PRIVATE' | 'PUBLIC';
}

export interface EventsImage {
    id: string;
    owner: string;
    name: string;
    address: string;
    city: string;
    info: string;
    begin_date: Date;
    end_date: Date;
    public: Visibility;
    created_at: Date;
    price: Decimal;
    id_facility: string;
    image: string;
}

// SERVICE
export interface IEventService{
    createEvent(data: createEventInput): Promise<Event>;
    findEventByName(name: string): Promise<Event | null>;
    getEvents(): Promise<EventsImage[]>;
    getEventById(id: string): Promise<EventsImage | null>;
    //updateEventById(id: string, data: Partial<Event>): Promise<Event>;
    deletEventById(id: string): Promise<void>;
}

//REPOSITORY
export interface IEventRepository {
    create(data: Prisma.EventCreateInput): Promise<Event>;
    findByName(name: string): Promise<Event | null>;
    findEventById(id: string): Promise<Event | null>;
    findAllEvents(): Promise<Event[]>;
    updateEventById(id: string, updateData: Partial<Event>): Promise<Event>;
    deleteEventById(id: string): Promise<void>;
}