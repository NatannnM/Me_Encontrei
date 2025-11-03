import { FastifyInstance } from "fastify";
import { UserController } from "./userController";
import { UserService } from "./userService";
import { PrismaUserRepository } from "./userRepository";
import { VerifyJWT, VerifyAdmin, VerifyCurrentUser } from "src/middlewares";
import { FacilitiesOnUsersService } from "src/facilitiesOnUsers/facilitiesOnUsersService";
import { FacilityController } from "src/facilities/facilityController";
import { FacilityService } from "src/facilities/facilityService";
import { PrismaFacilityRepository } from "src/facilities/facilityRepository";
import { PrismaEventRepository } from "src/events/eventRepository";
import { EventService } from "src/events/eventService";
import { EventController } from "src/events/eventController";
import { EventsOnUsersService } from "src/eventsOnUsers/eventsOnUsersService";

async function userRoutes(app: FastifyInstance) {
    const prismaUserRepository = new PrismaUserRepository()
    const facilitiesOnUsersService = new FacilitiesOnUsersService();
    const facilityRepository = new PrismaFacilityRepository();
    const facilityService = new FacilityService(facilityRepository);
    const eventRepository = new PrismaEventRepository();
    const eventService = new EventService(eventRepository);
    const EventUserService = new EventsOnUsersService();
    const eventController = new EventController(eventService, EventUserService);    
    const facilitiesController = new FacilityController(facilityService, facilitiesOnUsersService, eventController);
    const userService = new UserService(prismaUserRepository);
    const userController = new UserController(userService, facilitiesOnUsersService, facilitiesController, EventUserService, eventController);
    


    app.post('/users', userController.create.bind(userController));
    app.get('/users', { preHandler: [VerifyJWT] }, userController.showAll.bind(userController));
    app.get('/users/:id', { preHandler: [VerifyJWT, VerifyCurrentUser] }, userController.showById.bind(userController));
    app.patch('/users/:id', { preHandler: [VerifyJWT, VerifyCurrentUser] }, userController.update.bind(userController));
    app.delete('/users/:id', { preHandler: [VerifyJWT, VerifyCurrentUser] }, userController.delete.bind(userController));

}

export default userRoutes;