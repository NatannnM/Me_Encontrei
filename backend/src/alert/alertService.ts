import { AppError } from "src/common/AppError";
import { IAlertService } from "./alertInterface";
import { PrismaAlertRepository } from "./alertRepository";
import { createAlertInput } from "./alertSchema";
import { Alert } from "@prisma/client";

export class AlertService implements IAlertService {
    constructor(private readonly alertRepository: PrismaAlertRepository) { }

    async createAlert(data: createAlertInput){
        const { title, description, begin_date, end_date, id_user, id_facility, id_event } = data;

        const alert = await this.alertRepository.create({
            title,
            description,
            begin_date,
            end_date,
            user: {connect: {id: id_user}},
            facility: id_facility ? {connect: {id: id_facility}} : undefined,
            event: id_event ? {connect: {id: id_event} } : undefined
        })

        return alert;
    }

    async getAlerts() {
        const alert = await this.alertRepository.findAllAlerts();
        
        const alerts = await Promise.all(
            alert.map(async (a) => {

                return{
                    id: a.id,
                    title: a.title,
                    description: a.description,
                    begin_date: a.begin_date,
                    end_date: a.end_date,
                    id_user: a.id_user,
                    id_facility: a.id_facility,
                    id_event: a.id_event
                };
            })
        )    

        return alerts;
    }

    async getAlertById(id: string) {
        const alert = await this.alertRepository.findAlertById(id);
        
        if (!alert) {
            throw new AppError('Alert not found', 404, {
                isOperational: true,
                code: 'ALERT_NOT_FOUND',
                details: 'Alert was not found',
            });
        }

        return{
            id: alert.id,
            title: alert.title,
            description: alert.description,
            begin_date: alert.begin_date,
            end_date: alert.end_date,
            id_user: alert.id_user,
            id_facility: alert.id_facility,
            id_event: alert.id_event
        };
    }

    async getAlertByFacilityId(id_facility: string): Promise<Alert[] | null> {
        const alerts = await this.alertRepository.findAlertByFacilityId(id_facility);

        if (!alerts) {
            throw new AppError('Alert not found', 404, {
                isOperational: true,
                code: 'ALERT_NOT_FOUND',
                details: 'Alert was not found',
            });
        }

        return alerts;
    }

    async getAlertByEventId(id_event: string): Promise<Alert[] | null> {
        const alerts = await this.alertRepository.findAlertByEventId(id_event);

        if (!alerts) {
            throw new AppError('Alert not found', 404, {
                isOperational: true,
                code: 'ALERT_NOT_FOUND',
                details: 'Alert was not found',
            });
        }

        return alerts;
    }

    async deletAlertById(id: string) {
        const alert = await this.alertRepository.findAlertById(id);

        if (!alert) {
            throw new AppError('Alert not found', 404, {
                isOperational: true,
                code: 'ALERT_NOT_FOUND',
                details: 'Alert was not found',
            });
        }

        await this.alertRepository.deleteAlertById(id);
    }
}
