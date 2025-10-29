import { FastifyInstance } from "fastify";
import { FacilitiesOnUsersController } from "./facilitiesOnUsersController";
import { PrismaFacilitiesOnUsersRepository } from "./facilitiesOnUsersRepository";
import { FacilitiesOnUsersService } from "./facilitiesOnUsersService";

async function facilitiesOnUsersRoutes(app: FastifyInstance){
    const prismaFacilitiesOnUsersRepository = new PrismaFacilitiesOnUsersRepository();
    const facilitiesOnUsersService = new FacilitiesOnUsersService(prismaFacilitiesOnUsersRepository);
    const facilitiesOnUsersController = new FacilitiesOnUsersController(facilitiesOnUsersService);

    app.post('/facilities-on-users', facilitiesOnUsersController.create.bind(facilitiesOnUsersController));
    app.get('/facilities-on-users', facilitiesOnUsersController.showAll.bind(facilitiesOnUsersController));
    app.get('/facilities-on-users/user/:id_user', facilitiesOnUsersController.showByUserId.bind(facilitiesOnUsersController));
    app.get('/facilities-on-users/facility/:id_facility', facilitiesOnUsersController.showByFacilityId.bind(facilitiesOnUsersController));
    app.delete('/facilities-on-users/user/:id_user', facilitiesOnUsersController.deleteByUserId.bind(facilitiesOnUsersController));
    app.delete('/facilities-on-users/facility/:id_facility', facilitiesOnUsersController.deleteByFacilityId.bind(facilitiesOnUsersController));
    app.delete('/facilities-on-users/:id_user/:id_facility', facilitiesOnUsersController.delete.bind(facilitiesOnUsersController));

}

export default facilitiesOnUsersRoutes;