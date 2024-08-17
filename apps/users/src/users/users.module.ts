import { AUTH_SERVICE } from '@libs/common';
import { GridFsMulterConfigService } from '@libs/data-access-files';
import { DataAccessUsersModule } from '@libs/data-access-users';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { CaslModule } from 'nest-casl';
import { FavoritePostsModule } from './favorite-posts/favorite-posts.module';
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
    MulterModule.registerAsync({ useClass: GridFsMulterConfigService }),
    CaslModule.forFeature({ permissions }),
    FavoritePostsModule,
    RouterModule.register([
      { path: '/users/:userId', module: FavoritePostsModule },
    ]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
