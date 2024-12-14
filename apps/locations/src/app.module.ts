import { JwtAuthGuard } from '@libs/common';
import { UserEntity } from '@libs/data-access-users';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { $Enums, PrismaClient } from '@prisma/client';
import { CaslModule } from 'nest-casl';
import { CustomPrismaModule } from 'nestjs-prisma';
import { LocationsModule } from './locations/locations.module';
import { AUTH_SERVICE } from '@libs/core';
import { extendPrismaClient } from '@libs/data-access-locations';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      cache: true,
      isGlobal: true,
    }),
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
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('AUTH_HOST'),
            port: +configService.getOrThrow<number>('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    LocationsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
