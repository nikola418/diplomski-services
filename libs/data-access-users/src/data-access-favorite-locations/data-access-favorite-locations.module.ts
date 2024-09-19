import { Module } from '@nestjs/common';
import { FavoriteLocationService } from './favorite-location.service';

@Module({
  providers: [FavoriteLocationService],
  exports: [FavoriteLocationService],
})
export class DataAccessFavoriteLocationsModule {}
