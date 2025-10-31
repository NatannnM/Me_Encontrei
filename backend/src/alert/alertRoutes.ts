import { FastifyInstance } from "fastify";
import { PrismaAlertRepository } from "./alertRepository";
import { AlertService } from "./alertService";
import { AlertController } from "./alertController";

async function alertRoutes(app: FastifyInstance) {
    const prismaAlertRepository = new PrismaAlertRepository()
    const alertService = new AlertService(prismaAlertRepository)
    const alertController = new AlertController(alertService);

    app.post('/alerts', alertController.create.bind(alertController));
    app.get('/alerts',  alertController.showAll.bind(alertController));
    app.get('/alerts/:id',  alertController.showById.bind(alertController));
    app.get('/alerts/facility/:facility_id', alertController.showByFacilityId.bind(alertController));
    app.delete('/alerts/:id',  alertController.delete.bind(alertController));

}

export default alertRoutes;