import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Module({
  imports: [],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class DataAccessLocationsModule {}
