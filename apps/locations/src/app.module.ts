import { AUTH_SERVICE, JwtAuthGuard } from '@libs/common';
import { extendPrismaClient } from 'libs/data-access-locations/src';
import { UserEntity } from '@libs/data-access-users';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { $Enums, PrismaClient } from '@prisma/client';
import { CaslModule } from 'nest-casl';
import { CustomPrismaModule } from 'nestjs-prisma';
import { LocationsModule } from './locations/locations.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    CustomPrismaModule.forRoot({
      isGlobal: true,
      name: 'CustomPrisma',
      client: extendPrismaClient(new PrismaClient()),
    }),
    CaslModule.forRoot({
      superuserRole: $Enums.Role.Admin,
      getUserFromRequest: (req) => new UserEntity(req.user),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RMQ_URL')],
            queue: 'auth',
          },
        }),
        inject: [ConfigService],
      },
    ]),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    LocationsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
