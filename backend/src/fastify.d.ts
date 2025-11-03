import 'fastify';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from "@prisma/client";

declare module 'fastify' {
    interface FastifyRequest {
        user: JwtPayLoad & { id: string; username: string; email: string; password_hash: string; created_at: Date; role: Role; profile_pic?: string};
    }
}