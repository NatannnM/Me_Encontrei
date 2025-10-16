import { Facility, Prisma, Visibility } from "@prisma/client";
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { createFacilityInput } from "./facilitySchema";

//CONTROLLER
export interface IFacilityController {
    create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showAll(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showById(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    update(_req: FastifyRequest<UpdateFacilityRequest>, reply: FastifyReply): Promise<FastifyReply>;
    delete(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}

export interface UpdateFacilityRequest extends RouteGenericInterface {
    Params: {id: string};
    Body: {
        location?: string;
        city?: string;
        name?: string;
        description?: string;
        owner?: string;
        public?: Visibility;
        photo?: Buffer;
        map?: Buffer;
    }
}

export type UpdateFacilityData = Partial<Facility>

export interface FacilityVisibility{
    visibility: 'PRIVATE' | 'PUBLIC';
}

export interface FacilitiesImage {
  id: string;
  location: string;
  name: string;
  description?: string;
  owner: string;
  public: Visibility;  
  created_at: Date;
  image: string;
  imageMap: string;       
}

// SERVICE
export interface IFacilityService{
    createFacility(data: createFacilityInput): Promise<Facility>;
    findFacilityByName(name: string): Promise<Facility | null>;
    getFacilities(): Promise<FacilitiesImage[]>;
    getFacilityById(id: string): Promise<FacilitiesImage | null>;
    updateFacilityById(id: string, data: Partial<Facility>): Promise<Facility>;
    deletFacilityById(id: string): Promise<void>;
}

//REPOSITORY
export interface IFacilityRepository {
    create(data: Prisma.FacilityCreateInput): Promise<Facility>;
    findByName(name: string): Promise<Facility | null>;
    findFacilityById(id: string): Promise<Facility | null>;
    findAllFacilities(): Promise<Facility[]>;
    updateFacilityById(id: string, updateData: Partial<Facility>): Promise<Facility>;
    deleteFacilityById(id: string): Promise<void>;
}