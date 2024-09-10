import { Module } from '@nestjs/common';
import { FavoriteLocationsService } from './favorite-locations.service';

@Module({
  providers: [FavoriteLocationsService],
  exports: [FavoriteLocationsService],
})
export class DataAccessFavoriteLocationsModule {}
