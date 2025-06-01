import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test'),
    PORT: Joi.number().default(3000),
    MONGO_URI: Joi.string().uri().required(),
});

export const appConfig = () => ({
    PORT: parseInt(process.env.PORT!),
    NODE_ENV: process.env.NODE_ENV!,
    MONGO_URI: process.env.MONGO_URI!
});