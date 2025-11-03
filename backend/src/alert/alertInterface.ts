import { Alert, Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { createAlertInput } from "./alertSchema";

//CONTROLLER
export interface IAlertController {
    create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showAll(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showById(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showByFacilityId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    delete(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}

// SERVICE
export interface IAlertService{
    createAlert(data: createAlertInput): Promise<Alert>;
    getAlerts(): Promise<Alert[]>;
    getAlertById(id: string): Promise<Alert | null>;
    getAlertByFacilityId(id_facility: string): Promise<Alert[] | null>;
    deletAlertById(id: string): Promise<void>;
}

//REPOSITORY
export interface IAlertRepository {
    create(data: Prisma.AlertCreateInput): Promise<Alert>;
    findAlertById(id: string): Promise<Alert | null>;
    findAlertByFacilityId(id_facility: string): Promise<Alert[] | null>;
    findAlertByEventId(id_event: string): Promise<Alert[] | null>;
    findAllAlerts(): Promise<Alert[]>;
    deleteAlertById(id: string): Promise<void>;
}