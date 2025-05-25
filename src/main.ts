import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/env.config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector),
      { strategy: 'excludeAll', }
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no decoradas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Convierte el payload a la instancia del DTO
    }),
  );

  const configService = app.get(ConfigService);
  const appConfig = AppConfig.getInstance().init(configService);
  const port = appConfig.PORT;

  await app.listen(port);
  console.log(`App inicializada. Escuchando en el puerto ${port}`);


}
bootstrap();
