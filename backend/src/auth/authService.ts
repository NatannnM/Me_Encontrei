import { PrismaUserRepository } from "src/users/userRepository";
import { CreateUserInput, LoginInput } from "./authSchema";
import { AppError } from "src/common/AppError";
import { IAuthService } from "./authInterfaces";
import { isStrongPassword, isValidEmail, isValidUsername } from "src/common/utils";
import { compare, hash } from "bcryptjs";
import { FastifyReply } from "fastify";

export class AuthService implements IAuthService {
  constructor(private readonly userRepository: PrismaUserRepository) { }

  async createUser(data: CreateUserInput) {
    const { username, email, password } = data;

    const usernameExists = await this.userRepository.findByUsername(username);
    const emailExists = await this.userRepository.findByEmail(email);

    const conflictFields: Record<string, string> = {};

    if (usernameExists) conflictFields.username = 'Username already exists';
    if (emailExists) conflictFields.email = 'Email already exists';

    if (Object.keys(conflictFields).length > 0) {
      throw new AppError('User already exists', 409, {
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

    const user = await this.userRepository.create({
      username,
      email,
      password_hash,
      created_at: new Date(),
      role: 'USER'
    })

    const { password_hash: _, ...safeUser } = user;

    return safeUser;
  }

  async login(data: LoginInput, reply: FastifyReply) {
    const { username, password } = data;

    const user = await this.userRepository.findByUsername(username);

    if (!user || !(await compare(password, user.password_hash))) {
      throw new AppError('Invalid username or password', 401, {
        isOperational: true,
        code: 'INVALID_USERNAME_OR_PASSWORD',
        details: 'Invalid username or password',
      });
    }

    return reply.jwtSign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        role: user.role,
        profile_pic: user.profile_pic
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "1h",
        },
      }
    );
  }
}