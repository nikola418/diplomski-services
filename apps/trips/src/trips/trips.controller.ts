import { AuthUser, PaginatedResult } from '@libs/common';
import {
  CreateTripDto,
  QueryTripsDto,
  TripEntity,
  TripsService,
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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { $Enums, Trip, User } from '@prisma/client';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';

@ApiTags('trips')
@UseGuards(AccessGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseAbility(Actions.create, TripEntity)
  create(@AuthUser() user: User, @Body() data: CreateTripDto): Promise<Trip[]> {
    return this.tripsService.createMany(
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
    return this.tripsService.paginate(queries, user);
  }

  @Get(':id')
  @UseAbility<Trip, any>(Actions.read, TripEntity, [
    TripsService,
    (tripsService: TripsService, { params, user }) => {
      return tripsService.findOne(
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
    return this.tripsService.findOne({ id });
  }

  @Patch(':id')
  @UseAbility<Trip, any>(Actions.read, TripEntity, [
    TripsService,
    (tripsService: TripsService, { params }) => {
      return tripsService.findOne({ id: params.id });
    },
  ])
  update(@Param('id') id: string, @Body() data: UpdateTripDto): Promise<Trip> {
    return this.tripsService.update({ id }, data);
  }

  @Delete(':id')
  @UseAbility<Trip, any>(Actions.read, TripEntity, [
    TripsService,
    (tripsService: TripsService, { params }) => {
      return tripsService.findOne({ id: params.id });
    },
  ])
  remove(@Param('id') id: string): Promise<Trip> {
    return this.tripsService.remove({ id });
  }
}
