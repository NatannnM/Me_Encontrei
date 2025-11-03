import { z } from "zod";

export const idSchema = z.object({
    id: z.string({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a string',
    }).uuid({ message: 'ID must be a valid UUID' }),
});

export const createUserSchema = z.object({
    username: z
        .string({
          required_error: 'Username is required',
          invalid_type_error: 'Username must be a string'
        })
        .min(4, { message: "Username must be at least 4 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" }),
    email: z
        .string({
          required_error: 'Email is required',
          invalid_type_error: 'Email must be a string'
        })
        .email({ message: "Invalid email format" }),
    password: z
        .string({
          required_error: 'Password is required',
          invalid_type_error: 'Password must be a string'
        })
        .min(8, { message: "Password must be at least 8 characters long" }),
    profile_pic: z
        .string({
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
        
    role: z.enum(['USER', 'ADMIN']).default('USER')
})

export type createUserInput = z.infer<typeof createUserSchema>;


