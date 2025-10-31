import { FastifyReply, FastifyRequest } from "fastify";
import { IAlertController } from "./alertInterface";
import { AlertService } from "./alertService";
import { createAlertSchema, idSchema } from "./alertSchema";

export class AlertController implements IAlertController {
    constructor(
        private readonly alertService: AlertService
    ) { }

    async create(req: FastifyRequest, reply: FastifyReply) {
        const data = createAlertSchema.parse(req.body);
        const alert = await this.alertService.createAlert(data);
        return reply.status(201).send({ alert });
    }

    async showAll(_req: FastifyRequest, reply: FastifyReply) {
        const alert = await this.alertService.getAlerts();
        return reply.status(200).send({ alert });
    }

    async showById(req: FastifyRequest, reply: FastifyReply) {
        const { id } = idSchema.parse(req.params);
        const alert = await this.alertService.getAlertById(id);
        return reply.status(200).send({ alert });
    }

    async showByFacilityId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>{
        const { facility_id } = _req.params as {facility_id: string};
        const data = await this.alertService.getAlertByFacilityId(facility_id);
        return reply.send(data);
    }

    async delete(req: FastifyRequest, reply: FastifyReply) {
        const { id } = idSchema.parse(req.params);
        await this.alertService.deletAlertById(id);
        return reply.status(204).send();
    }
}