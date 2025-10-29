import { FastifyInstance } from "fastify";
import { PrismaFacilityRepository } from "./facilityRepository";
import { FacilityService } from "./facilityService";
import { FacilityController } from "./facilityController";
import { FacilitiesOnUsersService } from "src/facilitiesOnUsers/facilitiesOnUsersService";

async function facilityRoutes(app: FastifyInstance) {
    const prismaFacilityRepository = new PrismaFacilityRepository()
    const facilityService = new FacilityService(prismaFacilityRepository);
    const facilitiesOnUsersService = new FacilitiesOnUsersService();
    const facilityController = new FacilityController(facilityService, facilitiesOnUsersService);

    app.post('/facilities', facilityController.create.bind(facilityController));
    app.get('/facilities',  facilityController.showAll.bind(facilityController));
    app.get('/facilities/:id',  facilityController.showById.bind(facilityController));
    app.patch('/facilities/:id',  facilityController.update.bind(facilityController));
    app.delete('/facilities/:id',  facilityController.delete.bind(facilityController));

}

export default facilityRoutes;