import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test'),
    PORT: Joi.number().default(3000),
});
export class AppConfig {
    public PORT: number;
    public NODE_ENV: string;

    private static instance: AppConfig;

    init(configService: ConfigService) {
        this.PORT = configService.get<number>('PORT')!;
        this.NODE_ENV = configService.get<string>('NODE_ENV')!;

        return this
    }

    private constructor() { }

    public static getInstance(): AppConfig {
        if (!AppConfig.instance) {
            AppConfig.instance = new AppConfig();
        }
        return AppConfig.instance;
    }
}
