import { z } from "zod";

export const idSchema = z.object({
    id: z.string({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a string',
    }).uuid({ message: 'ID must be a valid UUID' }),
});

export const createEventSchema = z.object({
    owner: z
        .string({
            required_error: 'Dono é obrigatório!',
            invalid_type_error: "O campo dono deve ser do tipo string"
        })
        .min(4, {message: "O campo dono deve ter no mínimo 4 caracteres"})
        .max(60, {message: "O campo dono deve ter no máximo 60 caracteres"}),
    name: z   
        .string({
            required_error: 'Nome é obrigatório!',
            invalid_type_error: 'Nome deve ser do tipo string'
        })
        .min(2, {message: "nome deve ter no mínimo 20 caracteres"})
        .max(255, {message: "nome deve ter no máximo 255 caracteres"}),
    address: z
        .string({
            required_error: 'Endereço é obrigatório!',
            invalid_type_error: 'Endereço deve ser do tipo string'
        })
        .min(20, {message: "Endereço deve ter no mínimo 20 caracteres"})
        .max(255, {message: "Endereço deve ter no máximo 255 caracteres"}),
    city: z
        .string({
            required_error: 'Cidade é obrigatória!',
            invalid_type_error: 'Cidade deve ser do tipo string'
        })
        .min(4, {message: "Cidade deve ter no mínimo 20 caracteres"})
        .max(100, {message: "Cidade deve ter no máximo 255 caracteres"}),
    info: z
        .string({
            required_error: 'A informação sobre o evento é obrigatória!',
            invalid_type_error: "A informação sobre o evento deve ser do tipo string"
        })    
        .min(20, {message: "A informação sobre o evento deve ter no mínimo 20 caracteres"})
        .max(800, {message: "A informação sobre o evento deve ter no máximo 800 caracteres"}),
    begin_date: z.coerce.date({
        required_error: "Data do início do evento é obrigatória",
        invalid_type_error: "Data do início do evento deve ser válida"
    }),
    end_date: z.coerce.date({
        required_error: "Data do fim do evento é obrigatória",
        invalid_type_error: "Data do fim do evento deve ser válida"
    }),
    price: z
        .number({
            required_error: 'Preço é obrigatório',
            invalid_type_error: 'Preço deve ser um número'
        })
        .min(0, {message: 'Preço não pode ser negativo'}),
    id_facility: z
        .string({
            required_error: 'O id do estabelecimento é obrigatório',
            invalid_type_error: 'O id do estabelecimento deve ser uma string'
        })
        .uuid({ message: "O id do usuário deve ser um UUID válido"}),
    photo: z
        .string({
            required_error: 'A imagem é obrigatória!'
        })
        .refine((val) => {
            try {
                const cleaned = val.replace(/^data:.*;base64,/, '');
                Buffer.from(cleaned, 'base64');
                return true;
                } catch {
                    return false;
                }
        }, 
        {
            message: 'Formato base64 inválido',
        }),        
});

export type createEventInput = z.infer<typeof createEventSchema>;