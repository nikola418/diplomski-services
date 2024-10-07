import { JwtAuthGuard } from '@libs/common';
import { AUTH_SERVICE } from '@libs/core';
import { UserEntity } from '@libs/data-access-users';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { $Enums } from '@prisma/client';
import { CaslModule } from 'nest-casl';
import { PrismaModule } from 'nestjs-prisma';
import { FavoriteLocationModule } from './favorite-locations';
import { UsersModule } from './users';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    CaslModule.forRoot<$Enums.Role>({
      superuserRole: $Enums.Role.Admin,
      getUserFromRequest: (req) => new UserEntity(req.user),
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: AUTH_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.getOrThrow<string>('AUTH_HOST'),
              port: configService.getOrThrow<number>('AUTH_PORT'),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
    RouterModule.register([
      { path: '/users/:userId', module: FavoriteLocationModule },
    ]),
    UsersModule,
    FavoriteLocationModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
