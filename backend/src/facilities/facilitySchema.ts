import { z } from "zod";

export const idSchema = z.object({
    id: z.string({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a string',
    }).uuid({ message: 'ID must be a valid UUID' }),
});


export const createFacilitySchema = z.object({
    location: z
        .string({
            required_error: 'Localização é obrigatória!',
            invalid_type_error: 'Localização deve ser do tipo string'
        })
        .min(20, {message: "Localização deve ter no mínimo 20 caracteres"})
        .max(255, {message: "Localização deve ter no máximo 255 caracteres"}),
    city: z
        .string({
            required_error: 'Cidade é obrigatória!',
            invalid_type_error: 'Cidade deve ser do tipo string'
        })
        .min(4, {message: "Cidade deve ter no mínimo 20 caracteres"})
        .max(100, {message: "Cidade deve ter no máximo 255 caracteres"}),
    name: z   
        .string({
            required_error: 'Nome é obrigatório!',
            invalid_type_error: 'Nome deve ser do tipo string'
        })
        .min(2, {message: "nome deve ter no mínimo 20 caracteres"})
        .max(255, {message: "nome deve ter no máximo 255 caracteres"}),
    description: z
        .string({
            required_error: 'A descrição é obrigatória!',
            invalid_type_error: "A descrição deve ser do tipo string"
        })    
        .min(20, {message: "A descrição deve ter no mínimo 20 caracteres"})
        .max(800, {message: "A descrição deve ter no máximo 800 caracteres"}),
    owner: z
        .string({
            required_error: 'Dono é obrigatório!',
            invalid_type_error: "O campo dono deve ser do tipo string"
        })
        .min(4, {message: "O campo dono deve ter no mínimo 4 caracteres"})
        .max(60, {message: "O campo dono deve ter no máximo 60 caracteres"}),
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
})

export type createFacilityInput = z.infer<typeof createFacilitySchema>;
