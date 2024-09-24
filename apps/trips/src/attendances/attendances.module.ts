import { Module } from '@nestjs/common';
import { AttendancesController } from './attendances.controller';
import { DataAccessAttendanceModule } from '@libs/data-access-trips';
import { permissions } from './permissions';
import { CaslModule } from 'nest-casl';

@Module({
  imports: [CaslModule.forFeature({ permissions }), DataAccessAttendanceModule],
  controllers: [AttendancesController],
})
export class AttendancesModule {}
