import { FacilitiesOnUsers, Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { createFacilitiesOnUsersInput } from "./facilitiesOnUsersSchema";

//CONTROLLER
export interface IFacilitiesOnUsersController{
    create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showAll(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showByUserId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showByFacilityId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    delete(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    deleteByUserId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    deleteByFacilityId(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}

//SERVICE
export interface IFacilitiesOnUsersService{
    createFacilitiesOnUsers(data: createFacilitiesOnUsersInput): Promise<FacilitiesOnUsers>;
    getFacilitiesOnUsersByUserId(id: string): Promise<FacilitiesOnUsers[] | null>;
    getFacilitiesOnUsersByFacilityId(id: string): Promise<FacilitiesOnUsers[] | null>;
    getFacilitiesOnUsers(): Promise<FacilitiesOnUsers[]>;
    deleteFacilitiesOnUsersByUserId(id: string): Promise<void>;
    deleteFacilitiesOnUsersByFacilityId(id: string): Promise<void>;   
    deleteFacilitiesOnUsers(id_user: String, id_facility: string): Promise<void>
}

//REPOSITORY
export interface IFacilitiesOnUsersRepository{
    create(data: Prisma.FacilitiesOnUsersCreateInput): Promise<FacilitiesOnUsers>;
    findFacilitiesOnUsersByUserId(id: string): Promise<FacilitiesOnUsers[] | null>;
    findFacilitiesOnUsersByFacilityId(id: string): Promise<FacilitiesOnUsers[] | null>;
    findAllFacilitiesOnUsers(): Promise<FacilitiesOnUsers[]>;
    deleteFacilitiesOnUsers(id_user: string, id_facility: string): Promise<void>;
    deleteFacilitiesOnUsersByUserId(id: string,): Promise<void>;
    deleteFacilitiesOnUsersByFacilityId(id: string,): Promise<void>;
}