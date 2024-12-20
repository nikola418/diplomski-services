import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from '@libs/common';
import { cors, setupSwagger } from '@libs/core';
import { validationExceptionFactory } from '@libs/core/factories';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors,
  });
  const configService = app.get(ConfigService);

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

  const httpAdapter = app.getHttpAdapter();
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));

  const httpPort = configService.getOrThrow<string>('HTTP_PORT');
  await app.listen(httpPort, '0.0.0.0', async () => {
    const logger = new Logger();
    logger.log(`🚀 Application started on: ${await app.getUrl()}`);
  });
}

bootstrap();
