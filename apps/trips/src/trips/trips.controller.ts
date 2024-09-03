import { AuthUser } from '@libs/common';
import {
  CreateTripDto,
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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Trip, User } from '@prisma/client';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';

@ApiTags('trips')
@UseGuards(AccessGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseAbility(Actions.create, TripEntity)
  create(@AuthUser() user: User, @Body() data: CreateTripDto) {
    return this.tripsService.createMany(
      data.connectChatGroups.map((chatGroup) => ({
        chatGroupId: chatGroup.chatGroupId,
        locationId: data.locationId,
        name: data.name,
        creatorUserId: user.id,
        scheduledDateTime: data.scheduledDateTime,
      })),
    );
  }

  @Get()
  @UseAbility<Trip>(Actions.read, TripEntity)
  findAll(@AuthUser() user: User) {
    return this.tripsService.findAll({
      chatGroup: {
        OR: [
          { ownerUserId: user.id },
          { chatGroupMembers: { some: { userId: user.id } } },
        ],
      },
    });
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
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne({ id });
  }

  @Patch(':id')
  @UseAbility<Trip, any>(Actions.read, TripEntity, [
    TripsService,
    (tripsService: TripsService, { params }) => {
      return tripsService.findOne({ id: params.id });
    },
  ])
  update(@Param('id') id: string, @Body() data: UpdateTripDto) {
    return this.tripsService.update({ id }, data);
  }

  @Delete(':id')
  @UseAbility<Trip, any>(Actions.read, TripEntity, [
    TripsService,
    (tripsService: TripsService, { params }) => {
      return tripsService.findOne({ id: params.id });
    },
  ])
  remove(@Param('id') id: string) {
    return this.tripsService.remove({ id });
  }
}
