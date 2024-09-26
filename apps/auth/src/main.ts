import { cors, PrismaExceptionFilter, setupSwagger } from '@libs/common';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors,
  });
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });
  app.setGlobalPrefix('api');

  const appName = configService.getOrThrow<string>('APP_NAME');
  setupSwagger(app, appName);
  app.enableVersioning();
  app.enableShutdownHooks();

  app.use(helmet());
  app.use(cookieParser());
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

  const httpAdapter = app.getHttpAdapter();
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));

  const httpPort = configService.getOrThrow<string>('HTTP_PORT');
  await app.startAllMicroservices();
  await app.listen(httpPort, '0.0.0.0', async () => {
    const logger = new Logger();
    logger.log(`🚀 Application started on: ${await app.getUrl()}`);
  });
}

bootstrap();
