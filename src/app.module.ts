import { Module } from '@nestjs/common';
import { ControllersModule } from './modules/controllers.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: validationSchema
    }),
    ControllersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
