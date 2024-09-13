import { GridFsMulterConfigService } from '@libs/data-access-files';
import { DataAccessUsersModule } from '@libs/data-access-users';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FavoriteLocationsModule } from './favorite-locations/favorite-location.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MulterModule.registerAsync({ useClass: GridFsMulterConfigService }),
    DataAccessUsersModule,
    FavoriteLocationsModule,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
