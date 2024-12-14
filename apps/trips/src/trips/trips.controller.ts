import { AuthUser } from '@libs/common';
import { PaginatedResult } from '@libs/core';
import {
  CreateTripDto,
  QueryTripsDto,
  TripEntity,
  TripService,
  UpdateTripDto,
} from '@libs/data-access-trips';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { $Enums, Trip, TripStatus, User } from '@prisma/client';
import { Actions, UseAbility } from 'nest-casl';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @UseAbility(Actions.create, TripEntity)
  create(@AuthUser() user: User, @Body() data: CreateTripDto): Promise<Trip[]> {
    console.log(data);
    return this.tripService.createMany(
      data.connectChatGroups.map((chatGroup) => ({
        chatGroupId: chatGroup.chatGroupId,
        locationId: data.locationId,
        name: data.name,
        creatorUserId: user.id,
        scheduledDateTime: data.scheduledDateTime,
        tripStatus: data.scheduledDateTime
          ? $Enums.TripStatus.Scheduled
          : undefined,
      })),
    );
  }

  @Get()
  @UseAbility<Trip>(Actions.read, TripEntity)
  findAll(
    @Query() queries: QueryTripsDto,
    @AuthUser() user: User,
  ): Promise<PaginatedResult<Trip>> {
    return this.tripService.paginate(queries, user);
  }

  @Get(':id')
  @UseAbility<Trip, any>(Actions.read, TripEntity, [
    TripService,
    (tripService: TripService, { params, user }) => {
      return tripService.findOne(
        { id: params.id },
        {
          chatGroup: {
            include: { chatGroupMembers: { where: { userId: user.id } } },
          },
        },
      );
    },
  ])
  findOne(@Param('id') id: string): Promise<Trip> {
    return this.tripService.findOne({ id });
  }

  @Patch(':id')
  @UseAbility<Trip, any>(Actions.update, TripEntity, [
    TripService,
    async (tripService: TripService, { params }) => {
      return tripService.findOne({ id: params.id });
    },
  ])
  update(@Param('id') id: string, @Body() data: UpdateTripDto): Promise<Trip> {
    return this.tripService.update(
      { id },
      {
        ...data,
        tripStatus: data.scheduledDateTime
          ? TripStatus.Scheduled
          : data.tripStatus,
      },
    );
  }

  @Delete(':id')
  @UseAbility<Trip, any>(Actions.delete, TripEntity, [
    TripService,
    (tripService: TripService, { params }) => {
      return tripService.findOne({ id: params.id });
    },
  ])
  remove(@Param('id') id: string): Promise<Trip> {
    return this.tripService.remove({ id });
  }
}
