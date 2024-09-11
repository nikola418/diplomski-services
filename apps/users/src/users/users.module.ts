import { DataAccessUsersModule } from '@libs/data-access-users';
import { Module } from '@nestjs/common';
import { FavoriteLocationsModule } from './favorite-locations/favorite-location.module';
import { UsersController } from './users.controller';

@Module({
  imports: [DataAccessUsersModule, FavoriteLocationsModule],
  controllers: [UsersController],
})
export class UsersModule {}
