import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [TripsController],
})
export class TripsModule {}
