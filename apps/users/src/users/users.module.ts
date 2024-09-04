import { AUTH_SERVICE } from '@libs/common';
import { DataAccessFilesModule } from '@libs/data-access-files';
import { DataAccessUsersModule } from '@libs/data-access-users';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { CaslModule } from 'nest-casl';
import { FavoriteLocationsModule } from './favorite-locations/favorite-location.module';
import { permissions } from './permissions';
import { UsersController } from './users.controller';

@Module({
  imports: [
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
    DataAccessUsersModule,
    DataAccessFilesModule,
    MulterModule.register(),
    CaslModule.forFeature({ permissions }),
    FavoriteLocationsModule,
    RouterModule.register([
      { path: '/users/:userId', module: FavoriteLocationsModule },
    ]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
