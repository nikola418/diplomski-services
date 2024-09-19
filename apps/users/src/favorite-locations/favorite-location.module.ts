import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';
import { DataAccessFavoriteLocationsModule } from '@libs/data-access-users';
import { FavoriteLocationController } from './favorite-location.controller';

@Module({
  imports: [
    DataAccessFavoriteLocationsModule,
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [FavoriteLocationController],
})
export class FavoriteLocationModule {}
