import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FilesModule } from './files.module';

async function bootstrap() {
  const app = await NestFactory.create(FilesModule);
  app.enableCors({});
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: { queue: 'files', urls: [configService.get<string>('RMQ_URL')] },
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Files example')
    .setDescription('The files API description')
    .setVersion('1.0')
    .addTag('files')
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
