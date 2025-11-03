import { z } from "zod";

export const idSchema = z.object({
    id: z.string({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a string',
    }).uuid({ message: 'ID must be a valid UUID' }),
});

export const createAlertSchema = z.object({
    title: z
        .string({
            required_error: 'Título é obrigatório!',
            invalid_type_error: "O campo título deve ser do tipo string"
        })
        .min(4, {message: "O campo título deve ter no mínimo 4 caracteres"})
        .max(60, {message: "O campo título deve ter no máximo 60 caracteres"}),
    description: z
        .string({
            required_error: 'Descrição é obrigatório!',
            invalid_type_error: "O campo descrição deve ser do tipo string"
        })
        .min(4, {message: "O campo descrição deve ter no mínimo 4 caracteres"})
        .max(200, {message: "O campo descrição deve ter no máximo 200 caracteres"}),    
    begin_date: z.coerce.date({
        required_error: "Data do início do alerta é obrigatória",
        invalid_type_error: "Data do início do alerta deve ser válida"
    }),
    end_date: z.coerce.date({
        required_error: "Data do fim do alerta é obrigatória",
        invalid_type_error: "Data do fim do alerta deve ser válida"
    }), 
    id_user: z
        .string({
            required_error: 'O id do usuário é obrigatório',
            invalid_type_error: 'O id do usuário deve ser uma string'
        })
        .uuid({ message: "O id do usuário deve ser um UUID válido"}),
    id_facility: z
        .string({
            invalid_type_error: 'O id do estabelecimento deve ser uma string'            
        })
        .uuid({ message: "O id do estabelecimento deve ser um UUID válido"})
        .optional(),
    id_event: z
        .string({
            invalid_type_error: 'O id do evento deve ser uma string'            
        })
        .uuid({ message: "O id do evento deve ser um UUID válido"})
        .optional()
})

export type createAlertInput = z.infer<typeof createAlertSchema>;
