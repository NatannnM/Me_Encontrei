import { FastifyReply, FastifyRequest } from "fastify";
import { IFacilityController, UpdateFacilityData, UpdateFacilityRequest } from "./facilityInterfaces";
import { FacilityService } from "./facilityService";
import { createFacilitySchema, idSchema } from "./facilitySchema";
import { FacilitiesOnUsersService } from "src/facilitiesOnUsers/facilitiesOnUsersService";
import { EventController } from "src/events/eventController";

interface CreateFacilityRequest {
    userId: string; 
}

export class FacilityController implements IFacilityController {
    constructor(
        private readonly facilityService: FacilityService,
        private facilitiesOnUsersServices: FacilitiesOnUsersService,
        private eventController: EventController
    ) { }

    async create(req: FastifyRequest, reply: FastifyReply) {
        const body = req.body as CreateFacilityRequest;
        const userId = body.userId;
        const data = createFacilitySchema.parse(req.body);
        try{
            const facility = await this.facilityService.createFacility(data);
            const result = await this.facilitiesOnUsersServices.createFacilitiesOnUsers({
                id_user: userId,
                id_facility: facility.id,
                creator: true,
            });

            return reply.status(201).send({ facility });
        } catch(error){
            return reply.status(500).send({ message: 'Erro ao criar o estabelecimento e vínculo.' });
        }
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
        const data = req.body as UpdateFacilityData;
        console.log(data.public);
        const facility = await this.facilityService.updateFacilityById(id, data);
        return reply.status(200).send({ facility });
    }

    async delete(req: FastifyRequest, reply: FastifyReply) {
        const { id } = idSchema.parse(req.params);
        await this.eventController.deleteByFacilityId(id);
        await this.facilitiesOnUsersServices.deleteFacilitiesOnUsersByFacilityId(id);
        await this.facilityService.deletFacilityById(id);
        return reply.status(204).send();
    }
}