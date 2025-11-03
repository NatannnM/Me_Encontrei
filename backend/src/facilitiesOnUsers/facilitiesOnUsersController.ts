import { FastifyReply, FastifyRequest } from "fastify";
import { IFacilitiesOnUsersController } from "./facilitiesOnUsersInterfaces";
import { FacilitiesOnUsersService } from "./facilitiesOnUsersService";
import { createFacilitiesOnUsersSchema } from "./facilitiesOnUsersSchema";

interface deleteFacilitiesOnUsersParams {
    id_user: string;
    id_facility: string;
}

export class FacilitiesOnUsersController implements IFacilitiesOnUsersController{
    constructor(private readonly fac_userService: FacilitiesOnUsersService){}

    async create(req: FastifyRequest, reply: FastifyReply){
        const data = createFacilitiesOnUsersSchema.parse(req.body);
        const fac_users = await this.fac_userService.createFacilitiesOnUsers(data);
        return reply.status(201).send({ fac_users });
    }

    async showAll(_req: FastifyRequest, reply: FastifyReply){
        const fac_users = await this.fac_userService.getFacilitiesOnUsers();
        return reply.status(200).send({ fac_users });
    }

    async showByUserId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { id } = _req.params as {id: string};
        const data = await this.fac_userService.getFacilitiesOnUsersByUserId(id);
        return reply.send(data);
    }

    async showByFacilityId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { id_facility } = _req.params as {id_facility: string};
        const data = await this.fac_userService.getFacilitiesOnUsersByFacilityId(id_facility);
        return reply.send(data);
    }

    async delete(_req: FastifyRequest<{ Params: deleteFacilitiesOnUsersParams}>, reply: FastifyReply): Promise<FastifyReply> {
        const { id_user, id_facility } = _req.params;

        try{
            await this.fac_userService.deleteFacilitiesOnUsers(id_user, id_facility);
            return reply.status(200).send({ message: 'Conexão excluída com sucesso.'});
        } catch(error) {
            return reply.status(500).send({ message: 'Erro ao excluir conexão.'});
        }
    }

    async deleteByUserId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { id } = _req.params as { id: string };
        await this.fac_userService.deleteFacilitiesOnUsersByUserId(id);
        return reply.status(204).send();
    }

    async deleteByFacilityId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { id } = _req.params as { id: string };
        await this.fac_userService.deleteFacilitiesOnUsersByFacilityId(id);
        return reply.status(204).send();
    }
}