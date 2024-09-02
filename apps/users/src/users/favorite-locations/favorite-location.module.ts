import { Module } from '@nestjs/common';
import { DataAccessFavoriteLocationsModule } from 'libs/data-access-locations/src';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';
import { FavoriteLocationsController } from './favorite-location.controller';

@Module({
  imports: [
    CaslModule.forFeature({ permissions }),
    DataAccessFavoriteLocationsModule,
  ],
  controllers: [FavoriteLocationsController],
})
export class FavoriteLocationsModule {}
