import { cors, PrismaExceptionFilter } from '@libs/common';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { RmqOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors,
  });
  const configService = app.get(ConfigService);
  const httpAdapter = app.getHttpAdapter();

  app.connectMicroservice<RmqOptions>(
    {
      transport: Transport.RMQ,
      options: {
        noAck: true,
        urls: [configService.getOrThrow<string>('RMQ_URL')],
        queue: 'users',
      },
    },
    { inheritAppConfig: true },
  );

  app.enableVersioning();
  app.enableShutdownHooks();

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const res = {};
        errors.forEach((err) => {
          res[err.property] = Object.values(err.constraints);
        });
        return new BadRequestException(res);
      },
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('Users example')
    .setDescription('The Users API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const httpPort = configService.getOrThrow<string>('HTTP_PORT');

  await app.startAllMicroservices();

  await app.listen(httpPort, '0.0.0.0', async () => {
    const logger = new Logger();
    logger.log(`Application started on: ${await app.getUrl()}`);
  });
}

bootstrap();
