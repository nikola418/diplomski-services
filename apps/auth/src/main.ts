import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    cors: {
      credentials: true,
      origin: [
        'http://localhost:8100',
        'http://192.168.1.108:8100',
        'http://172.18.0.1:8100',
      ],
    },
  });
  const configService = app.get(ConfigService);
  const httpAdapter = app.getHttpAdapter();

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      noAck: true,
      urls: [configService.getOrThrow<string>('RMQ_URL')],
      queue: 'auth',
    },
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableVersioning();
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
  );
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Auth example')
    .setDescription('The Auth API description')
    .setVersion('1.0')
    .addTag('Auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const httpPort = configService.getOrThrow('HTTP_PORT');

  await app.startAllMicroservices();
  await app.listen(httpPort, '0.0.0.0', () => {
    const logger = new Logger();
    logger.log(`Application started on port: ${httpPort}`);
  });
}

bootstrap();
