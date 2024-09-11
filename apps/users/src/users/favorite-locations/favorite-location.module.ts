import { Module } from '@nestjs/common';
import { FavoriteLocationsController } from './favorite-location.controller';
import { DataAccessFavoriteLocationsModule } from '@libs/data-access-users';

@Module({
  imports: [DataAccessFavoriteLocationsModule],
  controllers: [FavoriteLocationsController],
})
export class FavoriteLocationsModule {}
