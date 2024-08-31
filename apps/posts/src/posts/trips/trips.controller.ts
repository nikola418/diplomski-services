import {
  CreateTripDto,
  TripsService,
  UpdateTripDto,
} from '@libs/data-access-chat-groups';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('trips')
@Controller()
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Put()
  create(@Param('postId') postId: string, @Body() data: CreateTripDto) {
    return this.tripsService.createMany(
      data.chatGroups.map((chatGroup) => ({
        chatGroupId: chatGroup.chatGroupId,
        postId,
      })),
    );
  }

  @Get()
  findAll(
    @Param('postId') postId: string,
    @Param('chatGroupId') chatGroupId: string,
  ) {
    return this.tripsService.findOne({
      chatGroupId_postId: { chatGroupId, postId },
    });
  }

  @Get(':chatGroupId')
  findOne(
    @Param('postId') postId: string,
    @Param('chatGroupId') chatGroupId: string,
  ) {
    return this.tripsService.findOne({
      chatGroupId_postId: { chatGroupId, postId },
    });
  }

  @Patch(':chatGroupId')
  update(
    @Param('postId') postId: string,
    @Param('chatGroupId') chatGroupId: string,
    @Body() data: UpdateTripDto,
  ) {
    return this.tripsService.update(
      { chatGroupId_postId: { chatGroupId, postId } },
      data,
    );
  }

  @Delete(':chatGroupId')
  remove(
    @Param('postId') postId: string,
    @Param('chatGroupId') chatGroupId: string,
  ) {
    return this.tripsService.remove({
      chatGroupId_postId: { chatGroupId, postId },
    });
  }
}
