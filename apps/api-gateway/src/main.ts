import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { cors } from '@libs/core';
import { setupSwagger } from '@libs/core';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors,
  });
  const configService = app.get(ConfigService);
  const httpProtocol = configService.getOrThrow('HTTP_PROTOCOL');
  const hostname = configService.getOrThrow('HOSTNAME');
  const appName = configService.getOrThrow<string>('APP_NAME');
  const httpPort = configService.getOrThrow<string>('HTTP_PORT');

  setupSwagger(app, appName, {
    explorer: true,
    swaggerUiEnabled: true,
    swaggerOptions: {
      urls: [
        {
          name: 'auth',
          url: `${httpProtocol}://${hostname}/docs/auth/yaml/`,
        },
        {
          name: 'users',
          url: `${httpProtocol}://${hostname}/docs/users/yaml/`,
        },
        {
          name: 'locations',
          url: `${httpProtocol}://${hostname}/docs/locations/yaml/`,
        },
        {
          name: 'trips',
          url: `${httpProtocol}://${hostname}/docs/trips/yaml/`,
        },
        {
          name: 'files',
          url: `${httpProtocol}://${hostname}/docs/files/yaml/`,
        },
        {
          name: 'chats',
          url: `${httpProtocol}://${hostname}/docs/chats/yaml/`,
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

  await app.listen(httpPort, '0.0.0.0', async () => {
    const logger = new Logger();
    logger.log(`🚀 Application started on: ${await app.getUrl()}`);
  });
}

bootstrap();
