import { Facility, Prisma } from "@prisma/client";
import { IFacilityRepository } from "./facilityInterfaces";
import { prisma } from "src/common/prismaClient";

export class PrismaFacilityRepository implements IFacilityRepository {
    async create(data: Prisma.FacilityCreateInput) {
        const facility = await prisma.facility.create({
            data,
        })

        return facility;
    }

    async findByName(name: string) {
        const facility = await prisma.facility.findUnique({
            where: {
                name,
            }
        })

        return facility;
    }

    async findFacilityById(id: string) {
        const facility = await prisma.facility.findFirst({
            where: {
                id,
            }
        })

        return facility;
    }

    async findAllFacilities() {
        const facilities = await prisma.facility.findMany({
            select: {
                id: true,
                location: true,
                city: true,
                name: true,
                description: true,
                owner: true,
                public: true,
                created_at: true,
                photo: true,
                map: true
            }
        })
        return facilities;
    }

    async updateFacilityById(id: string, data: Partial<Facility>) {
        const facility = await prisma.facility.update({
            where: { id },
            data,
        })

        return facility;
    }

    async deleteFacilityById(id: string) {
        await prisma.facility.delete({
            where: { id }
        });
    }
}