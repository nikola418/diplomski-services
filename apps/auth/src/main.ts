import { HttpToRpcExceptionFilter, PrismaExceptionFilter } from '@libs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const ctx = await NestFactory.createApplicationContext(AppModule, {});
  const configService = ctx.get(ConfigService);

  const rmqUrl = configService.getOrThrow<string>('RMQ_URL');
  ctx.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        noAck: true,
        urls: [rmqUrl],
        queue: 'auth',
      },
    },
  );

  app.enableShutdownHooks();
  app.useGlobalFilters(
    new PrismaExceptionFilter(),
    new HttpToRpcExceptionFilter(),
  );

  await app.listen();
}

bootstrap();
