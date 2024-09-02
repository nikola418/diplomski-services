import { DataAccessTripsModule } from '@libs/data-access-trips';
import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';
import { TripsController } from './trips.controller';

@Module({
  imports: [CaslModule.forFeature({ permissions }), DataAccessTripsModule],
  controllers: [TripsController],
})
export class TripsModule {}
