import { FastifyReply, FastifyRequest } from "fastify";
import { IEventsOnUsersController } from "./eventsOnUsersInterfaces";
import { createEventsOnUsersSchema } from "./eventsOnUsersSchema";
import { EventsOnUsersService } from "./eventsOnUsersService";

interface deleteEventsOnUsersParams {
    id_user: string;
    id_event: string;
}

export class EventsOnUsersController implements IEventsOnUsersController{
    constructor(private readonly evt_userService: EventsOnUsersService){}

    async create(req: FastifyRequest, reply: FastifyReply){
        const data = createEventsOnUsersSchema.parse(req.body);
        const evt_users = await this.evt_userService.createEventsOnUsers(data);
        return reply.status(201).send({ evt_users });
    }

    async showAll(_req: FastifyRequest, reply: FastifyReply){
        const evt_users = await this.evt_userService.getEventsOnUsers();
        return reply.status(200).send({ evt_users });
    }

    async showByUserId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { id } = _req.params as {id: string};
        const data = await this.evt_userService.getEventsOnUsersByUserId(id);
        return reply.send(data);
    }

    async showByEventId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { id } = _req.params as {id: string};
        const data = await this.evt_userService.getEventsOnUsersByEventId(id);
        return reply.send(data);
    }

    async delete(_req: FastifyRequest<{ Params: deleteEventsOnUsersParams }>, reply: FastifyReply): Promise<FastifyReply> {
        const { id_user, id_event } = _req.params;

        try{
            await this.evt_userService.deleteEventsOnUsers(id_user, id_event);
            return reply.status(200).send({ message: 'Conexão excluída com sucesso.'});
        } catch(error) {
            return reply.status(500).send({ message: 'Erro ao excluir conexão.'});
        }
    }

    async deleteByUserId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { id } = _req.params as { id: string };
        await this.evt_userService.deleteEventsOnUsersByUserId(id);
        return reply.status(204).send();
    }

    async deleteByEventId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { id } = _req.params as { id: string };
        await this.evt_userService.deleteEventsOnUsersByEventId(id);
        return reply.status(204).send();
    }
}