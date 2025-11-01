import { prisma } from "src/common/prismaClient";
import { IFacilitiesOnUsersRepository } from "./facilitiesOnUsersInterfaces";
import { FacilitiesOnUsers, Prisma, Role, Visibility } from "@prisma/client";

interface FacilityData {
    id: string;
    location:string
    city:string
    name: string;
    description:string;
    owner:string;
    public: Visibility;
    created_at : Date;
    photo: Uint8Array | null; 
    map: Uint8Array | null;
}

interface UserData {
    id: string;
    username: string;
    email: string;
    created_at: Date;
    profile_pic: Uint8Array | null;
    role: Role;
}

interface FacilitiesOnUsersData {
  id_user: string;
  id_facility: string;
  creator: boolean;
  facility: FacilityData; 
}

interface FacilitiesOnUsersDataUser {
  id_user: string;
  id_facility: string;
  creator: boolean;
  user: UserData; 
}

export class PrismaFacilitiesOnUsersRepository implements IFacilitiesOnUsersRepository{
    async create(data: Prisma.FacilitiesOnUsersCreateInput){
        const fac_users = await prisma.facilitiesOnUsers.create({
            data,
        })

        return fac_users;
    }

    async findFacilitiesOnUsersByUserId(id_user: string): Promise<FacilitiesOnUsersData[] | null> {
        return prisma.facilitiesOnUsers.findMany({
            where: { id_user },
            include: { facility:true }
        });        
    }

    async findFacilitiesOnUsersByFacilityId(id_facility: string): Promise<FacilitiesOnUsersDataUser[] | null> {
        return await prisma.facilitiesOnUsers.findMany({
            where: { 
                id_facility: id_facility,
            },
            include: { user:true }
        });        
    }

    async findAllFacilitiesOnUsers(): Promise<FacilitiesOnUsers[]> {
        return prisma.facilitiesOnUsers.findMany({
            include: { user: true, facility: true}
        });
    }

    async deleteFacilitiesOnUsers(id_user: string, id_facility: string): Promise<void> {
        await prisma.facilitiesOnUsers.delete({
            where: {
                id_user_id_facility: {
                    id_user,
                    id_facility
                }
            }
        })
    }

    async deleteFacilitiesOnUsersByUserId(id_user: string): Promise<void> {
        await prisma.facilitiesOnUsers.deleteMany({ where: {id_user}});        
    }

    async deleteFacilitiesOnUsersByFacilityId(id_facility: string): Promise<void> {
        await prisma.facilitiesOnUsers.deleteMany({ where: { id_facility } });
    }
}