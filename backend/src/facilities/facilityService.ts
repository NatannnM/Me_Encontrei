import { AppError } from "src/common/AppError";
import { PrismaFacilityRepository } from "./facilityRepository";
import { IFacilityService, UpdateFacilityData } from "./facilityInterfaces";
import { createFacilityInput } from "./facilitySchema";
import { Visibility } from "@prisma/client";
import { fileTypeFromBuffer } from "file-type";


export class FacilityService implements IFacilityService {
    constructor(private readonly facilityRepository: PrismaFacilityRepository) { }

    async createFacility(data: createFacilityInput){
        const { location, city, name, description, owner, photo, map } = data;

        const nameExists = await this.facilityRepository.findByName(name);

        const conflictFields: Record<string, string> = {};

        if (nameExists) conflictFields.name = 'Nome já existe';

        if(Object.keys(conflictFields).length > 0) {
            throw new AppError('Nome já existe', 409, {
                isOperational: true,
                code: 'NAME_EXISTS',
                details: conflictFields,
            });
        }
        const igualar = photo.match(/^data:(.+);base64,(.+)$/);
        const igualarMapa = map.match(/^data:(.+);base64,(.+)$/);

        if(!igualar || !igualarMapa){
            throw new AppError('Formato de imagem inválido')
        }

        const base64data = igualar[2];
        const base64dataMapa = igualarMapa[2];

        const photoBuffer = Buffer.from(base64data, 'base64');
        const photoBufferMapa = Buffer.from(base64dataMapa, 'base64');

        const facility = await this.facilityRepository.create({
            location,
            city,
            name,
            description,
            owner,
            public: 'PRIVATE',
            created_at: new Date(),
            photo: photoBuffer,
            map: photoBufferMapa,
        })

        return facility;
    }

    async findFacilityByName(name: string) {
        return this.facilityRepository.findByName(name);
    }

    async getFacilities() {
        const facility = await this.facilityRepository.findAllFacilities();

        const facilitiesImage = await Promise.all(
            facility.map(async (f) => {
                const buffer = Buffer.from(f.photo);
                const bufferMapa = Buffer.from(f.map);

                const fileType = await fileTypeFromBuffer(buffer);
                const fileTypeMapa = await fileTypeFromBuffer(bufferMapa);

                if(!fileType || !fileTypeMapa){
                    throw new AppError('Tipo de imagem não reconhecido', 400);
                }

                const base64 = buffer.toString('base64');
                const base64Mapa = bufferMapa.toString('base64');

                const dataUri = `data:${fileType.mime};base64,${base64}`;
                const dataUriMapa = `data:${fileTypeMapa.mime};base64,${base64Mapa}`;


                return{
                    id: f.id,
                    location: f.location,
                    city: f.city,
                    name: f.name,
                    description: f.description,
                    owner: f.owner,
                    public: f.public,
                    created_at: f.created_at,
                    image: dataUri,
                    imageMap: dataUriMapa
                };
            })
        );

        return facilitiesImage;
    }

    async getFacilityById(id: string) {
        const facility = await this.facilityRepository.findFacilityById(id);

        if (!facility) {
            throw new AppError('Facility not found', 404, {
                isOperational: true,
                code: 'FACILITY_NOT_FOUND',
                details: 'Facility was not found',
            });
        }

        const buffer = Buffer.from(facility.photo);
        const bufferMapa = Buffer.from(facility.map);

        const fileType = await fileTypeFromBuffer(buffer);
        const fileTypeMapa = await fileTypeFromBuffer(bufferMapa);

        if(!fileType || !fileTypeMapa){
            throw new AppError('Tipo de imagem não reconhecido', 400);
        }

        const base64 = buffer.toString('base64');
        const base64Mapa = bufferMapa.toString('base64');

        const dataUri = `data:${fileType.mime};base64,${base64}`;
        const dataUriMapa = `data:${fileTypeMapa.mime};base64,${base64Mapa}`;


        return{
            id: facility.id,
            location: facility.location,
            city: facility.city,
            name: facility.name,
            description: facility.description,
            owner: facility.owner,
            public: facility.public,
            created_at: facility.created_at,
            image: dataUri,
            imageMap: dataUriMapa
        };
    }

    async updateFacilityById(id: string, data: UpdateFacilityData) {
        const { location, name, description, owner, photo, public: newPublic } = data;

        const facility = await this.facilityRepository.findFacilityById(id);

        if (!facility) {
            throw new AppError('facility not found', 404, {
                isOperational: true,
                code: 'FACILITY_NOT_FOUND',
                details: 'Facility was not found',
            });
        }

        let nameExists = null
        

        if (name) {
            const existingName = await this.facilityRepository.findByName(name);

            if (existingName && existingName.id !== facility.id) {
                nameExists = existingName;
            }
        }

        const conflictFields: Record<string, string> = {};

        if (nameExists) {
            conflictFields.name = 'Nome já existe';
            

            throw new AppError('Já existe este estabelecimento', 409, {
                isOperational: true,
                code: 'FACILITY_EXISTS',
                details: conflictFields,
            });
        }
        
        if (Object.keys(conflictFields).length > 0) {
            throw new AppError('Invalid facility data', 400, {
                isOperational: true,
                code: 'INVALID_DATA',
                details: conflictFields,
            });
        }
        
        //Preparando valores
        const UpdateData: Partial <{
            location: string;
            name: string;
            description: string;
            owner: string;
            photo_url: Uint8Array;
            public: Visibility;
        }> = {};

        if (location) UpdateData.location = location;
        if (name) UpdateData.name = name;
        if (description) UpdateData.description = description;
        if (owner) UpdateData.owner = owner;
        if (photo) {
            if (photo instanceof Uint8Array) {
                UpdateData.photo_url = Buffer.from(photo.buffer);
            } else {
                UpdateData.photo_url = Buffer.from(photo, 'base64');
            }
        }
        //Verifica valor do public
        if (newPublic) {
            const validPublicValues: Visibility[] = ['PRIVATE', 'PUBLIC']; 
                if (!validPublicValues.includes(newPublic)) {
                    throw new AppError('Valor inválido para o campo "public"', 400, {
                        isOperational: true,
                        code: 'INVALID_PUBLIC_VALUE',
                        details: { public: 'O valor para "public" é inválido. Use "PRIVATE" ou "PUBLIC".' }
                    });
                }
            UpdateData.public = newPublic as Visibility;
        }

        const updatedFacility = await this.facilityRepository.updateFacilityById(id, UpdateData);

        return updatedFacility;
    }

    async deletFacilityById(id: string) {
        const facility = await this.facilityRepository.findFacilityById(id);

        if (!facility) {
            throw new AppError('Facility not found', 404, {
                isOperational: true,
                code: 'FACILITY_NOT_FOUND',
                details: 'Facility was not found',
            });
        }

        await this.facilityRepository.deleteFacilityById(id);
    }
}
