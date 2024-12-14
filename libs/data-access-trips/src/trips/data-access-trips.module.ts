import { Module } from '@nestjs/common';
import { TripService } from './trip.service';

@Module({
  providers: [TripService],
  exports: [TripService],
})
export class DataAccessTripsModule {}
