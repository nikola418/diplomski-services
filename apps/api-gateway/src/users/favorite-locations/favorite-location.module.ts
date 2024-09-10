import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';
import { FavoriteLocationsController } from './favorite-location.controller';
import { permissions } from './permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [FavoriteLocationsController],
})
export class FavoriteLocationsModule {}
