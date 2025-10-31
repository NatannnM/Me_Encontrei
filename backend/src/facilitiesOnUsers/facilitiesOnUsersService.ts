import { FacilitiesOnUsers, Role, Visibility } from "@prisma/client";
import { IFacilitiesOnUsersService } from "./facilitiesOnUsersInterfaces";
import { PrismaFacilitiesOnUsersRepository } from "./facilitiesOnUsersRepository";
import { createFacilitiesOnUsersInput } from "./facilitiesOnUsersSchema";
import { prisma } from "src/common/prismaClient";
import { AppError } from "src/common/AppError";
import { fileTypeFromBuffer } from "file-type";

interface FacilityData {
    id: string;
    location:string;
    city:string;
    name: string;
    description:string;
    owner:string;
    public: Visibility;
    created_at : Date;
    photo: string | null; 
    map: Uint8Array | null;
}

interface UserData {
    id: string;
    username: string;
    email: string;
    created_at: Date;
    profile_pic: string | null;
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

    async getFacilitiesOnUsersByUserId(id_user: string): Promise<FacilitiesOnUsersData[] | null> {
        const facilitiesOnUsers = await this.facilitiesOnUsersRepository.findFacilitiesOnUsersByUserId(id_user);
        
        if (!facilitiesOnUsers) {
            throw new AppError('FacilitiesOnUsers not found', 404, {
                isOperational: true,
                code: 'FACILITIESONUSERS_NOT_FOUND',
                details: 'FacilitiesOnUsers was not found',
            });
        }
        const facilitiesOnUsersComBase64 = await Promise.all(
            facilitiesOnUsers.map(async(facilities) => {
                const photo = facilities.facility.photo;
                let dataUri = null;
                
                if(photo){
                    const buffer = Buffer.from(photo);

                    const fileType = await fileTypeFromBuffer(buffer);

                    if (!fileType) {
                        throw new AppError('Tipo de imagem não reconhecido', 400);
                    }

                    const base64 = buffer.toString('base64');
                    dataUri = `data:${fileType.mime};base64,${base64}`;
                }

                
                return {
                    ...facilities,
                    facility: {
                        ...facilities.facility,
                        photo:dataUri,
                    },
                };
            })
        )
        return facilitiesOnUsersComBase64;
    }

    async getFacilitiesOnUsersByFacilityId(id_facility: string): Promise<FacilitiesOnUsersDataUser[] | null> {
        const facilitiesOnUsers = await this.facilitiesOnUsersRepository.findFacilitiesOnUsersByFacilityId(id_facility);
        
        if (!facilitiesOnUsers) {
            throw new AppError('FacilitiesOnUsers not found', 404, {
                isOperational: true,
                code: 'FACILITIESONUSERS_NOT_FOUND',
                details: 'FacilitiesOnUsers was not found',
            });
        }
        const facilitiesOnUsersComBase64 = await Promise.all(
            facilitiesOnUsers.map(async(users) => {
                const photo = users.user.profile_pic;
                let dataUri = null;
                
                if(photo){
                    const buffer = Buffer.from(photo);

                    const fileType = await fileTypeFromBuffer(buffer);

                    if (!fileType) {
                        throw new AppError('Tipo de imagem não reconhecido', 400);
                    }

                    const base64 = buffer.toString('base64');
                    dataUri = `data:${fileType.mime};base64,${base64}`;
                }

                
                return {
                    ...users,
                    user: {
                        ...users.user,
                        profile_pic:dataUri,
                    },
                };
            })
        )
        return facilitiesOnUsersComBase64;
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