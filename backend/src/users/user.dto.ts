import { User } from "@prisma/client";

export type UserResponseDTO = Omit<User, 'password_hash'> & {
    profile_pic: string | null;
};