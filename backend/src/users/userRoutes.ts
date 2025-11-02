import { FastifyInstance } from "fastify";
import { UserController } from "./userController";
import { UserService } from "./userService";
import { PrismaUserRepository } from "./userRepository";
import { VerifyJWT, VerifyAdmin, VerifyCurrentUser } from "src/middlewares";

async function userRoutes(app: FastifyInstance) {
    const prismaUserRepository = new PrismaUserRepository()
    const userService = new UserService(prismaUserRepository);
    const userController = new UserController(userService);

    app.get('/users', { preHandler: [VerifyJWT] }, userController.index.bind(userController));
    app.get('/users/:id', { preHandler: [VerifyJWT, VerifyCurrentUser] }, userController.show.bind(userController));
    app.patch('/users/:id', { preHandler: [VerifyJWT, VerifyCurrentUser] }, userController.update.bind(userController));
    app.delete('/users/:id', { preHandler: [VerifyJWT, VerifyCurrentUser] }, userController.delete.bind(userController));

}

export default userRoutes;