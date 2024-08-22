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
@Controller(':postId')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Put()
  create(
    @Param('chatGroupId') chatGroupId: string,
    @Param('postId') postId: string,
    @Body() data: CreateTripDto,
  ) {
    return this.tripsService.create({
      ...data,
      chatGroup: { connect: { id: chatGroupId } },
      post: { connect: { id: postId } },
    });
  }

  @Get()
  findAll(
    @Param('chatGroupId') chatGroupId: string,
    @Param('postId') postId: string,
  ) {
    return this.tripsService.findOne({
      chatGroupId_postId: { chatGroupId, postId },
    });
  }

  @Patch()
  update(
    @Param('chatGroupId') chatGroupId: string,
    @Param('postId') postId: string,
    @Body() data: UpdateTripDto,
  ) {
    return this.tripsService.update(
      { chatGroupId_postId: { chatGroupId, postId } },
      data,
    );
  }

  @Delete()
  remove(
    @Param('chatGroupId') chatGroupId: string,
    @Param('postId') postId: string,
  ) {
    return this.tripsService.remove({
      chatGroupId_postId: { chatGroupId, postId },
    });
  }
}
