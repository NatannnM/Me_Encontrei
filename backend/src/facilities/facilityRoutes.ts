import { FastifyInstance } from "fastify";
import { PrismaFacilityRepository } from "./facilityRepository";
import { FacilityService } from "./facilityService";
import { FacilityController } from "./facilityController";
import { FacilitiesOnUsersService } from "src/facilitiesOnUsers/facilitiesOnUsersService";
import { EventController } from "src/events/eventController";
import { EventService } from "src/events/eventService";
import { PrismaEventRepository } from "src/events/eventRepository";
import { EventsOnUsersService } from "src/eventsOnUsers/eventsOnUsersService";

async function facilityRoutes(app: FastifyInstance) {
    const prismaFacilityRepository = new PrismaFacilityRepository()
    const facilityService = new FacilityService(prismaFacilityRepository);
    const facilitiesOnUsersService = new FacilitiesOnUsersService();
    const eventRepository = new PrismaEventRepository();
    const eventService = new EventService(eventRepository);
    const EventUserService = new EventsOnUsersService();
    const eventController = new EventController(eventService, EventUserService);
    const facilityController = new FacilityController(facilityService, facilitiesOnUsersService, eventController);

    app.post('/facilities', facilityController.create.bind(facilityController));
    app.get('/facilities',  facilityController.showAll.bind(facilityController));
    app.get('/facilities/:id',  facilityController.showById.bind(facilityController));
    app.patch('/facilities/:id',  facilityController.update.bind(facilityController));
    app.delete('/facilities/:id',  facilityController.delete.bind(facilityController));

}

export default facilityRoutes;