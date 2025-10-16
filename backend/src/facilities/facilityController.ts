import { FastifyReply, FastifyRequest } from "fastify";
import { IFacilityController, UpdateFacilityRequest } from "./facilityInterfaces";
import { FacilityService } from "./facilityService";
import { createFacilitySchema, idSchema } from "./facilitySchema";

export class FacilityController implements IFacilityController {
    constructor(private readonly facilityService: FacilityService) { }

    async create(req: FastifyRequest, reply: FastifyReply) {
        const data = createFacilitySchema.parse(req.body);
        const facility = await this.facilityService.createFacility(data);
        return reply.status(201).send({ facility });
    }

    async showAll(_req: FastifyRequest, reply: FastifyReply) {
        const facility = await this.facilityService.getFacilities();
        return reply.status(200).send({ facility });
    }

    async showById(req: FastifyRequest, reply: FastifyReply) {
        const { id } = idSchema.parse(req.params);
        const facility = await this.facilityService.getFacilityById(id);
        return reply.status(200).send({ facility });
    }

    async update(req: FastifyRequest<UpdateFacilityRequest>, reply: FastifyReply) {
        const { id } = req.params;
        const data = req.body;

        if(data.photo && typeof data.photo === 'string') {
            data.photo = Buffer.from(data.photo, 'base64');
        }

        const facility = await this.facilityService.updateFacilityById(id, data);
        return reply.status(200).send({ facility });
    }

    async delete(req: FastifyRequest, reply: FastifyReply) {
        const { id } = idSchema.parse(req.params);
        await this.facilityService.deletFacilityById(id);
        return reply.status(204).send();
    }
}