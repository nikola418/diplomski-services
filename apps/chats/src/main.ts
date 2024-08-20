import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './chat-groups/redis-io.adapter';

export const appOptions = {
  cors: {
    credentials: true,
    origin: [
      'http://localhost:8100',
      'http://192.168.1.108:8100',
      'http://172.18.0.1:8100',
    ],
  },
};

const middlewares = [cookieParser()];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, appOptions);
  const configService = app.get(ConfigService);
  const httpAdapter = app.getHttpAdapter();

  app.enableVersioning();
  app.enableShutdownHooks();

  app.use(middlewares);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Chat Groups example')
    .setDescription('The chat groups API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const httpPort = configService.getOrThrow<string>('HTTP_PORT');

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(httpPort, '0.0.0.0', async () => {
    const logger = new Logger();
    logger.log(`Application started on: ${await app.getUrl()}`);
  });
}

bootstrap();
