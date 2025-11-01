import { AppError } from "src/common/AppError";
import { IEventService, UpdateEventData } from "./eventInterfaces";
import { PrismaEventRepository } from "./eventRepository";
import { createEventInput } from "./eventSchema";
import { Visibility } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { fileTypeFromBuffer } from "file-type";

export class EventService implements IEventService {
    constructor(private readonly eventRepository: PrismaEventRepository) { }

    async createEvent(data: createEventInput){
        const { owner, name, address, city, info, begin_date, end_date, price, id_facility, photo } = data;

        const igualar = photo.match(/^data:(.+);base64,(.+)$/);

        if(!igualar){
            throw new AppError('Formato de imagem inválido')
        }

        const base64data = igualar[2];

        const photoBuffer = Buffer.from(base64data, 'base64');

        const event = await this.eventRepository.create({
            owner,
            name,
            address,
            city,
            info,
            begin_date,
            end_date,
            public: 'PRIVATE',
            price,
            created_at: new Date(),
            facility: {connect: {id: id_facility}},
            photo: photoBuffer
        })

        return event;
    }

    async findEventByName(name: string) {
        return this.eventRepository.findByName(name);
    }

    async getEvents() {
        const event = await this.eventRepository.findAllEvents();
        
        const events = await Promise.all(
            event.map(async (e) => {
                const buffer = Buffer.from(e.photo);
                
                const fileType = await fileTypeFromBuffer(buffer);
                
                if(!fileType){
                    throw new AppError('Tipo de imagem não reconhecido', 400);
                }
                
                const base64 = buffer.toString('base64');
                
                const dataUri = `data:${fileType.mime};base64,${base64}`;
                
                
                return{
                    id: e.id,
                    owner: e.owner,
                    name: e.name,
                    address: e.address,
                    city: e.city,
                    info: e.info,
                    begin_date: e.begin_date,
                    end_date: e.end_date,
                    public: e.public,
                    price: e.price,
                    created_at: e.created_at,    
                    id_facility: e.id_facility,
                    image: dataUri
                };
            })
        )    

        return events;
    }

    async getEventById(id: string) {
        const event = await this.eventRepository.findEventById(id);
        
        if (!event) {
            throw new AppError('Event not found', 404, {
                isOperational: true,
                code: 'EVENT_NOT_FOUND',
                details: 'Event was not found',
            });
        }

        const buffer = Buffer.from(event.photo);
        
        const fileType = await fileTypeFromBuffer(buffer);

        if(!fileType){
            throw new AppError('Tipo de imagem não reconhecido', 400);
        }
                
        const base64 = buffer.toString('base64');
                
        const dataUri = `data:${fileType.mime};base64,${base64}`;
                


        return{
            id: event.id,
            owner: event.owner,
            name: event.name,
            address: event.address,
            city: event.city,
            info: event.info,
            begin_date: event.begin_date,
            end_date: event.end_date,
            public: event.public,
            price: event.price,
            created_at: event.created_at,    
            id_facility: event.id_facility,
            image: dataUri
        };
    }

    /*async updateEventById(id: string, data: UpdateEventData) {
        const { owner, name, address, city, info, begin_date, end_date, public: newPublic, price, id_facility } = data;

        const event = await this.eventRepository.findEventById(id);

        if (!event) {
            throw new AppError('event not found', 404, {
                isOperational: true,
                code: 'EVENT_NOT_FOUND',
                details: 'Event was not found',
            });
        }
        
        //Preparando valores
        const UpdateData: Partial <{
            owner: string;
            name: string;
            address: string;
            city: string;
            info: string;
            begin_date: Date;
            end_date: Date;
            public: Visibility;
            price: Decimal;
            id_facility: string;
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
    }*/

    async deletEventById(id: string) {
        const event = await this.eventRepository.findEventById(id);

        if (!event) {
            throw new AppError('Event not found', 404, {
                isOperational: true,
                code: 'EVENT_NOT_FOUND',
                details: 'Event was not found',
            });
        }

        await this.eventRepository.deleteEventById(id);
    }

    async deleteEventByFacilityId(id_facility: string){
        return this.eventRepository.deleteEventByFacilityId(id_facility);
    }
}
