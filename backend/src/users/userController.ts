import { FastifyReply, FastifyRequest } from "fastify";
import { IUserController, UpdateUserData, UpdateUserRequest, UserRole } from "./userInterfaces";
import { createUserSchema, idSchema } from "./userSchema";
import { UserService } from "./userService";
import { FacilitiesOnUsersService } from "src/facilitiesOnUsers/facilitiesOnUsersService";
import { FacilityService } from "src/facilities/facilityService";
import { EventsOnUsersService } from "src/eventsOnUsers/eventsOnUsersService";
import { EventService } from "src/events/eventService";
import { EventController } from "src/events/eventController";
import { FacilityController } from "src/facilities/facilityController";

export class UserController implements IUserController {
    constructor(private readonly userService: UserService,
                private facilitiesOnUsersService: FacilitiesOnUsersService,
                private facilitiesController: FacilityController,
                private eventOnUsersService: EventsOnUsersService,
                private eventController: EventController
    ) { }

    async index(_req: FastifyRequest, reply: FastifyReply) {
        const user = await this.userService.getUsers();
        return reply.status(200).send({ user });
    }

    async create(req: FastifyRequest, reply: FastifyReply){
        console.log('CHEGO AQUI aaaaaa');
        const data = createUserSchema.parse(req.body);
        const user = await this.userService.createUser(data);
        return reply.status(201).send({ user });
    }

    async showById(req: FastifyRequest, reply: FastifyReply) {
        const { id } = idSchema.parse(req.params);
        const user = await this.userService.getUserById(id);
        return reply.status(200).send({ user });
    }

    async showAll(req: FastifyRequest, reply: FastifyReply){
        const user = await this.userService.getUsers();
        return reply.status(200).send({ user });
    }

    async update(req: FastifyRequest<UpdateUserRequest>, reply: FastifyReply) {
        const { id } = req.params;
        const data = req.body as UpdateUserData;
        const isAdmin = (req.user as UserRole).role === 'ADMIN';
        const user = await this.userService.updateUserById(id, data, isAdmin);
        return reply.status(200).send({ user });
    }

    async delete(req: FastifyRequest, reply: FastifyReply) {
        const { id } = idSchema.parse(req.params);
        const events = await this.eventOnUsersService.getEventsOnUsersByUserId(id);
        if(events){
            const deletePromises = events.map((e) => {
                const Req = { params: {id: e.id_event} } as FastifyRequest;
                const Reply = { 
                    status: () => ({ send: () => {} })
                } as unknown as FastifyReply;
                this.eventController.delete(Req, Reply);
            }) 
            await Promise.all(deletePromises);
        }
        const facilities = await this.facilitiesOnUsersService.getFacilitiesOnUsersByUserId(id);
        if(facilities){
            const deletePromises = facilities.map((f) => {
                const Req = { params: {id: f.id_facility} } as FastifyRequest;
                const Reply = { 
                    status: () => ({ send: () => {} })
                } as unknown as FastifyReply;
                this.facilitiesController.delete(Req, Reply);
            })
            await Promise.all(deletePromises);
        }

        await this.userService.deleteUserById(id);
        return reply.status(204).send();
    }
}