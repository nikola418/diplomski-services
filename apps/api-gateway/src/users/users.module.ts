import {
  DataAccessFilesModule,
  GridFsMulterConfigService,
} from '@libs/data-access-files';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { CaslModule } from 'nest-casl';
import { FavoriteLocationsModule } from './favorite-locations/favorite-location.module';
import { permissions } from './permissions';
import { UsersController } from './users.controller';

@Module({
  imports: [
    DataAccessFilesModule,
    MulterModule.register({}),
    CaslModule.forFeature({ permissions }),
    FavoriteLocationsModule,
    RouterModule.register([
      { path: '/users/:userId', module: FavoriteLocationsModule },
    ]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
