import { cors, setupSwagger, validationExceptionFactory } from '@libs/common';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors,
  });
  const configService = app.get(ConfigService);
  const httpAdapter = app.getHttpAdapter();

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
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
  );

  const httpPort = configService.getOrThrow<string>('HTTP_PORT');
  await app.listen(httpPort, '0.0.0.0', async () => {
    const logger = new Logger();
    logger.log(`🚀 Application started on: ${await app.getUrl()}`);
  });
}

bootstrap();
