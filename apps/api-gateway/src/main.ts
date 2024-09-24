import { cors, setupSwagger } from '@libs/common';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors,
  });
  const configService = app.get(ConfigService);

  const appName = configService.getOrThrow<string>('APP_NAME');
  setupSwagger(app, appName, {
    explorer: true,
    swaggerUiEnabled: true,
    swaggerOptions: {
      urls: [
        {
          name: 'auth',
          url: 'http://192.168.1.108:8080/docs/auth/yaml/',
        },
        {
          name: 'users',
          url: 'http://192.168.1.108:8080/docs/users/yaml/',
        },
        {
          name: 'locations',
          url: 'http://192.168.1.108:8080/docs/locations/yaml/',
        },
        {
          name: 'trips',
          url: 'http://192.168.1.108:8080/docs/trips/yaml/',
        },
        {
          name: 'files',
          url: 'http://192.168.1.108:8080/docs/files/yaml/',
        },
        {
          name: 'chats',
          url: 'http://192.168.1.108:8080/docs/chats/yaml/',
        },
      ],
    },
  });
  app.enableVersioning();
  app.enableShutdownHooks();

  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const message = new Object();
        errors.forEach((err) => {
          message[err.property] = Object.values(err.constraints);
        });
        return new BadRequestException({
          message,
          error: 'Bad Request',
          statusCode: 400,
        });
      },
    }),
  );

  const httpPort = configService.getOrThrow<string>('HTTP_PORT');
  await app.listen(httpPort, '0.0.0.0', async () => {
    const logger = new Logger();
    logger.log(`🚀 Application started on: ${await app.getUrl()}`);
  });
}

bootstrap();
