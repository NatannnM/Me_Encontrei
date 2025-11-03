import { FastifyInstance } from "fastify";
import { EventService } from "./eventService";
import { EventController } from "./eventController";
import { PrismaEventRepository } from "./eventRepository";
import { EventsOnUsersService } from "src/eventsOnUsers/eventsOnUsersService";

async function eventRoutes(app: FastifyInstance) {
    const prismaEventRepository = new PrismaEventRepository()
    const eventService = new EventService(prismaEventRepository);
    const eventsOnUsersService = new EventsOnUsersService();
    const eventController = new EventController(eventService, eventsOnUsersService);

    app.post('/events', eventController.create.bind(eventController));
    app.get('/events',  eventController.showAll.bind(eventController));
    app.get('/events/:id',  eventController.showById.bind(eventController));
    app.patch('/events/:id',  eventController.update.bind(eventController));
    app.delete('/events/:id',  eventController.delete.bind(eventController));
    app.delete('/events/facility/:id_facility', eventController.deleteByFacilityId.bind(eventController));

}

export default eventRoutes;