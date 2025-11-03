import { Prisma } from "@prisma/client";
import { IAlertRepository } from "./alertInterface";
import { prisma } from "src/common/prismaClient";

export class PrismaAlertRepository implements IAlertRepository {
    async create(data: Prisma.AlertCreateInput) {
        const alert = await prisma.alert.create({
            data,
        })

        return alert;
    }

    async findAlertById(id: string) {
        const alert = await prisma.alert.findFirst({
            where: {
                id,
            }
        })

        return alert;
    }

    async findAlertByFacilityId(id_facility: string){
        return await prisma.alert.findMany({
            where: {
                id_facility: id_facility,
            },
        });
    }

    async findAlertByEventId(id_event: string){
        return await prisma.alert.findMany({
            where: {
                id_event
            }
        })
    }

    async findAllAlerts() {
        const alerts = await prisma.alert.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                begin_date: true,
                end_date: true,
                id_user: true,
                id_facility: true,
                id_event: true
                
            }
        })
        return alerts;
    }

    async deleteAlertById(id: string) {
        await prisma.alert.delete({
            where: { id }
        });
    }
}