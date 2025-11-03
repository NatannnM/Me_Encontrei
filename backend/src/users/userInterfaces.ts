import { Prisma, Role, User } from "@prisma/client";
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { createUserInput } from "./userSchema";

// CONTROLLER
export interface IUserController {
    index(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showById(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    showAll(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    update(req: FastifyRequest<UpdateUserRequest>, reply: FastifyReply): Promise<FastifyReply>;
    delete(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}

export interface UpdateUserRequest extends RouteGenericInterface {
    Params: { id: string };
    Body: {
        username?: string;
        email?: string;
        password?: string;
        created_at?: Date;
        profile_pic?: string;
        role?: Role;
    };
}

export type UpdateUserData = Partial<Omit<User, 'id' | 'password_hash'>> & {
    password?: string;
    profile_pic?: string | Buffer | Uint8Array;
};

export type UpdateUserDataWithHash = Omit<UpdateUserData, 'password'> & { password_hash?: string };

export interface UserRole {
    role: 'ADMIN' | 'USER';
}

// SERVICE
export interface IUserService {
    createUser(data: createUserInput): Promise<User>;
    findUserByUsername(username: string): Promise<User | null>;
    getUsers(): Promise<Omit<{
        id: string;
        username: string;
        email: string;
        role: Role;
        created_at: Date;
        profile_pic: string | null;
    }, "password_hash">[]>;
    getUserById(id: string): Promise <Omit<{
        username: string;
        email: string;
        profile_pic: string | null; 
        role: Role;
        id: string;
        created_at: Date;
    },'password_hash'> | null>;
    updateUserById(id: string, data: Partial<User>, isAdmin: boolean): Promise<Omit<User, "password_hash">>;
    deleteUserById(id: string): Promise<void>;
}

// REPOSITORY
export interface IUserRepository {
    create(data: Prisma.UserCreateInput): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
    findAllUsers(): Promise<Omit<User, "password_hash">[]>;
    updateUserById(id: string, updateData: Partial<User>): Promise<User>;
    deleteUserById(id: string): Promise<void>;
}