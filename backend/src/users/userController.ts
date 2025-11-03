import { FastifyReply, FastifyRequest } from "fastify";
import { IUserController, UpdateUserData, UpdateUserRequest, UserRole } from "./userInterfaces";
import { createUserSchema, idSchema } from "./userSchema";
import { UserService } from "./userService";

export class UserController implements IUserController {
    constructor(private readonly userService: UserService) { }

    async index(_req: FastifyRequest, reply: FastifyReply) {
        const user = await this.userService.getUsers();
        return reply.status(200).send({ user });
    }

    async create(req: FastifyRequest, reply: FastifyReply){
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
        await this.userService.deleteUserById(id);
        return reply.status(204).send();
    }
}