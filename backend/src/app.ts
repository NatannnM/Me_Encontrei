import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { loggingHook } from "./hooks/logging";
import { setStartTimeHook } from "./hooks/setStartTime";
import { env } from "./env";
import authRoutes from "./auth/authRoutes";
import userRoutes from "./users/userRoutes";
import { AppError } from "./common/AppError";
import { ZodError } from "zod";
import facilityRoutes from "./facilities/facilityRoutes";
import eventRoutes from "./events/eventRoutes";
import facilitiesOnUsersRoutes from "./facilitiesOnUsers/facilitiesOnUsersRoutes";
import eventsOnUsersRoutes from "./eventsOnUsers/eventsOnUsersRoutes";
import alertRoutes from "./alert/alertRoutes";

export const app = fastify({
    bodyLimit: 10 * 1024 *1024,
});

app.register(fastifyCors, {
    //origin: env.FRONTEND_URL,
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
});

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Me Encontrei API',
            description: 'Documentação das rotas da API',
            version: '1.0.0',
        },
    },
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
    },
})

app.addHook('onRequest', setStartTimeHook);
app.addHook('onResponse', loggingHook);

app.register(authRoutes);
app.register(userRoutes);
app.register(facilityRoutes);
app.register(eventRoutes);
app.register(facilitiesOnUsersRoutes);
app.register(eventsOnUsersRoutes);
app.register(alertRoutes);

app.setErrorHandler((err: FastifyError | ZodError, _req: FastifyRequest, reply: FastifyReply) => {
    if (err instanceof AppError) {
        return reply.status(err.statusCode).send({
            message: err.message,
            isOperational: err.isOperational,
            code: err.code,
            details: err.details,
        });
    }

    if (err instanceof ZodError) {
        return reply.status(400).send({
            message: "Validation failed. Please check your input.",
            isOperational: true,
            code: "ZOD_VALIDATION_ERROR",
            details: err.errors.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
                code: issue.code,
                expected: (issue as any).expected,
                received: (issue as any).received,
            })),
        });
    }

    console.error(err);
    return reply.status(500).send({
        message: 'Internal server error',
        isOperational: false
    });
})