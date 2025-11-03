import { FastifyInstance } from "fastify";
import { PrismaEventsOnUsersRepository } from "./eventsOnUsersRepository";
import { EventsOnUsersService } from "./eventsOnUsersService";
import { EventsOnUsersController } from "./eventsOnUsersController";

async function eventsOnUsersRoutes(app: FastifyInstance){
    const prismaEventsOnUsersRepository = new PrismaEventsOnUsersRepository();
    const eventsOnUsersService = new EventsOnUsersService(prismaEventsOnUsersRepository);
    const eventsOnUsersController = new EventsOnUsersController(eventsOnUsersService);

    app.post('/events-on-users', eventsOnUsersController.create.bind(eventsOnUsersController));
    app.get('/events-on-users', eventsOnUsersController.showAll.bind(eventsOnUsersController));
    app.get('/events-on-users/user/:id_user', eventsOnUsersController.showByUserId.bind(eventsOnUsersController));
    app.get('/events-on-users/event/:id_event', eventsOnUsersController.showByEventId.bind(eventsOnUsersController));
    app.delete('/events-on-users/user/:id_user', eventsOnUsersController.deleteByUserId.bind(eventsOnUsersController));
    app.delete('/events-on-users/event/:id_event', eventsOnUsersController.deleteByEventId.bind(eventsOnUsersController));
    app.delete('/events-on-users/:id_user/:id_event', eventsOnUsersController.delete.bind(eventsOnUsersController));

}

export default eventsOnUsersRoutes;