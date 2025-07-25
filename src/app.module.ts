import { Module } from '@nestjs/common';
import { ControllersModule } from './modules/controllers.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig, validationSchema } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
      validationSchema: validationSchema,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri:  appConfig().MONGO_URI,
      }),
    }),
    ControllersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
