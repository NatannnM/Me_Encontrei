import { hash } from "bcryptjs";
import { IUserService, UpdateUserData, UpdateUserDataWithHash } from "./userInterfaces";
import { PrismaUserRepository } from "./userRepository";
import { isStrongPassword, isValidEmail, isValidUsername } from "src/common/utils";
import { AppError } from "src/common/AppError";
import { createUserInput } from "./userSchema";
import { fileTypeFromBuffer } from "file-type";

export class UserService implements IUserService {
    constructor(private readonly userRepository: PrismaUserRepository) { }

    async createUser(data: createUserInput){
        const { username, email, password, profile_pic, role} = data;

        let usernameExists = null
        let emailExists = null

        if (username) {
            const existingUsername = await this.userRepository.findByUsername(username);

            if (existingUsername) {
                usernameExists = existingUsername;
            }
        }

        if (email) {
            const existingEmail = await this.userRepository.findByEmail(email);

            if (existingEmail) {
                emailExists = existingEmail;
            }
        }

        const conflictFields: Record<string, string> = {};

        if (usernameExists || emailExists) {
            if (usernameExists) conflictFields.username = 'Username já existe';
            if (emailExists) conflictFields.email = 'Email já existe';

            throw new AppError('User já existe', 409, {
                isOperational: true,
                code: 'USER_EXISTS',
                details: conflictFields,
            });
        }

        if (!isValidUsername(username)) conflictFields.username = 'Invalid username format';
        if (!isValidEmail(email)) conflictFields.email = 'Invalid email format';
        if (!isStrongPassword(password)) conflictFields.password = 'Password does not meet strength requirements';

        if (Object.keys(conflictFields).length > 0) {
            throw new AppError('Invalid user data', 400, {
                isOperational: true,
                code: 'INVALID_DATA',
                details: conflictFields,
            });
        }

        const password_hash = await hash(password, 6);

        const igualar = profile_pic.match(/^data:(.+);base64,(.+)$/);

        if(!igualar){
            throw new AppError('Formato de imagem inválido')
        }

        const base64data = igualar[2];

        const photoBuffer = Buffer.from(base64data, 'base64');


        const user = await this.userRepository.create({
            username,
            email,
            password_hash,
            created_at: new Date(),
            profile_pic: photoBuffer,
            role
        })

        return user;
    }

    async findUserByUsername(username: string) {
        return this.userRepository.findByUsername(username);
    }

    async getUsers() {
        return this.userRepository.findAllUsers();
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findUserById(id);
       
        if (!user) {
            throw new AppError('User not found', 404, {
                isOperational: true,
                code: 'USER_NOT_FOUND',
                details: 'User was not found',
            });
        }

        let dataUri: string | null = null;

        if(user.profile_pic){
            const buffer = Buffer.isBuffer(user.profile_pic) ? user.profile_pic : Buffer.from(user.profile_pic);

            const fileType = await fileTypeFromBuffer(buffer);
            
            if(!fileType){
                throw new AppError('Tipo de imagem não reconhecido', 400);
            }
                        
            const base64 = buffer.toString('base64');
                
            dataUri = `data:${fileType.mime};base64,${base64}`;
            
        }

        const { password_hash: _, ...safeUser } = user;

        return {...safeUser, profile_pic:dataUri};
    }

    async updateUserById(id: string, data: UpdateUserData, isAdmin: boolean) {
        const { username, email, password, profile_pic, ...rest } = data;

        const user = await this.userRepository.findUserById(id);

        if (!user) {
            throw new AppError('User not found', 404, {
                isOperational: true,
                code: 'USER_NOT_FOUND',
                details: 'User was not found',
            });
        }

        let usernameExists = null
        let emailExists = null

        if (username) {
            const existingUsername = await this.userRepository.findByUsername(username);

            if (existingUsername && existingUsername.id !== user.id) {
                usernameExists = existingUsername;
            }
        }

        if (email) {
            const existingEmail = await this.userRepository.findByEmail(email);

            if (existingEmail && existingEmail.id !== user.id) {
                emailExists = existingEmail;
            }
        }

        const conflictFields: Record<string, string> = {};

        if (usernameExists || emailExists) {
            if (usernameExists) conflictFields.username = 'Username already exists';
            if (emailExists) conflictFields.email = 'Email already exists';

            throw new AppError('User already exists', 409, {
                isOperational: true,
                code: 'USER_EXISTS',
                details: conflictFields,
            });
        }

        // TODO: É possivel adicionar mais validações, já que um administrador pode mudar tudo.
        if (username && !isValidUsername(username)) conflictFields.username = 'Invalid username format';
        if (email && !isValidEmail(email)) conflictFields.email = 'Invalid email format';
        if (password && !isStrongPassword(password)) conflictFields.password = 'Password does not meet strength requirements';

        // exemplo
        // if (isAdmin && created_at && !isValidDate(created_at)) conflictFields.created_at = 'escrever aqui'

        if (Object.keys(conflictFields).length > 0) {
            throw new AppError('Invalid user data', 400, {
                isOperational: true,
                code: 'INVALID_DATA',
                details: conflictFields,
            });
        }

        let updatedData: UpdateUserDataWithHash = { ...rest };

        if (username) updatedData.username = username;
        if (email) updatedData.email = email;
        if (password) updatedData.password_hash = await hash(password, 6);
        if (profile_pic){
            let base64data:string;

            if (typeof profile_pic === 'string') {
                const igualar = profile_pic.match(/^data:(.+);base64,(.+)$/);
                if (!igualar) {
                    throw new AppError('Formato de imagem inválido');
                }
                base64data = igualar[2];  // Extraímos a parte base64 da string
            }else if (profile_pic instanceof Uint8Array || Buffer.isBuffer(profile_pic)) {
                 base64data = profile_pic.toString('base64');
            } else {
                throw new AppError('Formato de imagem inválido');
            }
            const photoBuffer = Buffer.from(base64data, 'base64');

            updatedData.profile_pic = photoBuffer;
        }

        if (!isAdmin) {
            const { created_at: _, role: __, ...allowedFields } = updatedData;
            updatedData = allowedFields;
        }



        const updatedUser = await this.userRepository.updateUserById(id, updatedData);

        const { password_hash: _, ...safeUpdatedUser } = updatedUser;
        
        return safeUpdatedUser;
    }

    async deleteUserById(id: string) {
        const user = await this.userRepository.findUserById(id);

        if (!user) {
            throw new AppError('User not found', 404, {
                isOperational: true,
                code: 'USER_NOT_FOUND',
                details: 'User was not found',
            });
        }

        await this.userRepository.deleteUserById(id);
    }
}
