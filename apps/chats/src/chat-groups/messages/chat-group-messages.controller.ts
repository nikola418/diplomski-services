import { AuthUser } from '@libs/common';
import { PaginatedResult } from '@libs/core';
import {
  ChatGroupMessagesService,
  CreateChatGroupMessageDto,
  QueryChatMessagesDto,
} from '@libs/data-access-chat-groups';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatGroupMessage, User } from '@prisma/client';

@ApiTags('messages')
@Controller()
export class ChatGroupMessagesController {
  constructor(
    private readonly chatGroupMessagesService: ChatGroupMessagesService,
  ) {}

  @Post()
  public create(
    @Param('chatGroupId') chatGroupId: string,
    @AuthUser() user: User,
    @Body() data: CreateChatGroupMessageDto,
  ) {
    return this.chatGroupMessagesService.create(chatGroupId, data, user);
  }

  @Get()
  public findAll(
    @Param('chatGroupId') chatGroupId: string,
    @Query() queries: QueryChatMessagesDto,
  ): Promise<PaginatedResult<ChatGroupMessage>> {
    return this.chatGroupMessagesService.paginate(chatGroupId, queries);
  }

  @Get(':messageId')
  public findOne(
    @Param('chatGroupId') chatGroupId: string,
    @Param('messageId') messageId: string,
  ): Promise<ChatGroupMessage> {
    return this.chatGroupMessagesService.findOne({
      chatGroupId,
      id: messageId,
    });
  }
}
