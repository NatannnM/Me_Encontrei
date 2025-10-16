import { FastifyReply, FastifyRequest } from "fastify";
import { IEventController } from "./eventInterfaces";
import { EventService } from "./eventService";
import { createEventSchema, idSchema } from "./eventSchema";

export class EventController implements IEventController {
    constructor(private readonly eventService: EventService) { }

    async create(req: FastifyRequest, reply: FastifyReply) {
        const data = createEventSchema.parse(req.body);
        const event = await this.eventService.createEvent(data);
        return reply.status(201).send({ event });
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
        await this.eventService.deletEventById(id);
        return reply.status(204).send();
    }
}