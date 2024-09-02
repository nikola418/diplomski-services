import {
  CreateTripDto,
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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() data: CreateTripDto) {
    return this.tripsService.createMany(
      data.connectChatGroups.map((chatGroup) => ({
        chatGroupId: chatGroup.chatGroupId,
        locationId: data.locationId,
        name: data.name,
        scheduledDateTime: data.scheduledDateTime,
      })),
    );
  }

  @Get()
  findAll() {
    return this.tripsService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateTripDto) {
    return this.tripsService.update({ id }, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripsService.remove({ id });
  }
}
