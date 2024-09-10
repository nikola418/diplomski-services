import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from 'nest-casl';
import { UserEntity } from '@libs/data-access-users';
import { $Enums } from '@prisma/client';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AUTH_SERVICE, JwtAuthGuard, USERS_SERVICE } from '@libs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    PassportModule,
    CaslModule.forRoot<$Enums.Role>({
      superuserRole: $Enums.Role.Admin,
      getUserFromRequest: (req) => new UserEntity(req.user),
    }),
    ClientsModule.registerAsync({
      clients: [
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
        {
          name: USERS_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RMQ_URL')],
              queue: 'users',
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
