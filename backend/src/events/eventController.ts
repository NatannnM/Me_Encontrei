import { FastifyReply, FastifyRequest } from "fastify";
import { IEventController } from "./eventInterfaces";
import { EventService } from "./eventService";
import { createEventSchema, idSchema } from "./eventSchema";
import { EventsOnUsersService } from "src/eventsOnUsers/eventsOnUsersService";

interface CreateEventRequest {
    userId: string
}

export class EventController implements IEventController {
    constructor(
        private readonly eventService: EventService,
        private eventsOnUsersServices: EventsOnUsersService,
    ) { }

    async create(req: FastifyRequest, reply: FastifyReply) {
        const body = req.body as CreateEventRequest;
        const userId = body.userId;
        const data = createEventSchema.parse(req.body);
        try{
            const event = await this.eventService.createEvent(data);
            await this.eventsOnUsersServices.createEventsOnUsers({
                id_user: userId,
                id_event: event.id,
                creator: true,
            });

            return reply.status(201).send({ event });
        } catch(error){
            return reply.status(500).send({ message: 'Erro ao criar o evento e vínculo.' });
        }
    }

    async showAll(_req: FastifyRequest, reply: FastifyReply) {
        const event = await this.eventService.getEvents();
        return reply.status(200).send({ event });
    }

    async showById(req: FastifyRequest, reply: FastifyReply) {
        const { id } = idSchema.parse(req.params);
        const event = await this.eventService.getEventById(id);
        return reply.status(200).send({ event });
    }

    /*async update(req: FastifyRequest<UpdateFacilityRequest>, reply: FastifyReply) {
        const { id } = req.params;
        const data = req.body;

        if(data.photo && typeof data.photo === 'string') {
            data.photo = Buffer.from(data.photo, 'base64');
        }

        const facility = await this.facilityService.updateFacilityById(id, data);
        return reply.status(200).send({ facility });
    }*/

    async delete(req: FastifyRequest, reply: FastifyReply) {
        const { id } = idSchema.parse(req.params);
        await this.eventsOnUsersServices.deleteEventsOnUsersByEventId(id);
        await this.eventService.deletEventById(id);
        return reply.status(204).send();
    }

    async deleteByFacilityId(id_facility: string): Promise<void>{
        await this.eventsOnUsersServices.deleteEventsOnUsersByFacilityId(id_facility);
        await this.eventService.deleteEventByFacilityId(id_facility);
    }
}