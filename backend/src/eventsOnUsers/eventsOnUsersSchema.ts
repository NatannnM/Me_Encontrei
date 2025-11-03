import { z } from "zod";

export const createEventsOnUsersSchema = z.object({
    id_user : z 
        .string({
            required_error: 'O id do usuário é obrigatório',
            invalid_type_error: 'O id do usuário deve ser uma string'
        })
        .uuid({ message: "O id do usuário deve ser um UUID válido"}),
    id_event : z 
        .string({
            required_error: 'O id do evento é obrigatório',
            invalid_type_error: 'O id do evento deve ser uma string'
        })
        .uuid({ message: "O id do evento deve ser um UUID válido"}),
    creator: z
        .boolean({
            required_error: 'O campo creator é obrigatório',
            invalid_type_error: 'O campo creator deve ser um valor booleano',
        })
});

export type createEventsOnUsersInput = z.infer<typeof createEventsOnUsersSchema>;