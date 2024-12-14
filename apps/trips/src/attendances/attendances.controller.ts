import {
  AttendanceEntity,
  AttendanceService,
  TripEntity,
} from '@libs/data-access-trips';
import { Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';

@ApiTags('attendances')
@Controller('attendances')
@UseGuards(AccessGuard)
export class AttendancesController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Put(':userId')
  @UseAbility(Actions.update, TripEntity)
  upsert(
    @Param('tripId') tripId: string,
    @Param('userId') userId: string,
  ): Promise<AttendanceEntity> {
    return this.attendanceService.upsert(tripId, userId);
  }

  @Get()
  @UseAbility(Actions.read, AttendanceEntity)
  findAll(@Param('tripId') tripId: string): Promise<AttendanceEntity[]> {
    return this.attendanceService.findAll(tripId);
  }

  @Get(':userId')
  @UseAbility(Actions.read, AttendanceEntity)
  findOne(
    @Param('tripId') tripId: string,
    @Param('userId') userId: string,
  ): Promise<AttendanceEntity> {
    return this.attendanceService.findOne(tripId, userId);
  }

  @Delete(':userId')
  @UseAbility(Actions.delete, AttendanceEntity)
  remove(
    @Param('tripId') tripId: string,
    @Param('userId') userId: string,
  ): Promise<AttendanceEntity> {
    return this.attendanceService.remove(tripId, userId);
  }
}
