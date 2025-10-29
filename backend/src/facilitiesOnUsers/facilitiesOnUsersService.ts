import { FacilitiesOnUsers } from "@prisma/client";
import { IFacilitiesOnUsersService } from "./facilitiesOnUsersInterfaces";
import { PrismaFacilitiesOnUsersRepository } from "./facilitiesOnUsersRepository";
import { createFacilitiesOnUsersInput } from "./facilitiesOnUsersSchema";
import { prisma } from "src/common/prismaClient";

export class FacilitiesOnUsersService implements IFacilitiesOnUsersService{
    constructor (private readonly facilitiesOnUsersRepository = new PrismaFacilitiesOnUsersRepository()){}

    async createFacilitiesOnUsers(data: createFacilitiesOnUsersInput): Promise<FacilitiesOnUsers> {
        const {id_user, id_facility, creator} = data;
        console.log(id_user);
        console.log(id_facility);
        console.log(creator);
        const user = await prisma.user.findUnique({
            where: { id: id_user}
        });

        const facility = await prisma.facility.findUnique({
            where: { id: id_facility}
        });

        if(!user || !facility){
            throw new Error('Usuário ou estabelecimento não encontrado');
        }

        const fac_user = await prisma.facilitiesOnUsers.create({
            data: {
                user: {
                    connect: {id: id_user}
                },
                facility: {
                    connect: {id: id_facility}
                },
                creator,
            }
        });

        return fac_user;
    }

    async getFacilitiesOnUsersByUserId(id_user: string): Promise<FacilitiesOnUsers[] | null> {
        return this.facilitiesOnUsersRepository.findFacilitiesOnUsersByUserId(id_user);
    }

    async getFacilitiesOnUsersByFacilityId(id_facility: string): Promise<FacilitiesOnUsers[] | null> {
        return this.facilitiesOnUsersRepository.findFacilitiesOnUsersByFacilityId(id_facility);
    }

    async getFacilitiesOnUsers(): Promise<FacilitiesOnUsers[]> {
        return this.facilitiesOnUsersRepository.findAllFacilitiesOnUsers();
    }

    async deleteFacilitiesOnUsersByUserId(id_user: string): Promise<void> {
        return this.facilitiesOnUsersRepository.deleteFacilitiesOnUsersByUserId(id_user);
    }

    async deleteFacilitiesOnUsersByFacilityId(id_facility: string): Promise<void> {
        return this.facilitiesOnUsersRepository.deleteFacilitiesOnUsersByFacilityId(id_facility);
    }

    async deleteFacilitiesOnUsers(id_user: string, id_facility: string): Promise<void> {
        await this.facilitiesOnUsersRepository.deleteFacilitiesOnUsers(id_user, id_facility);
    }


}