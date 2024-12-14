import { DataAccessTripsModule } from '@libs/data-access-trips';
import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';
import { TripTasksService } from './trip-tasks.service';
import { TripsController } from './trips.controller';

@Module({
  imports: [CaslModule.forFeature({ permissions }), DataAccessTripsModule],
  controllers: [TripsController],
  providers: [TripTasksService],
})
export class TripsModule {}
