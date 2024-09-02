import { AuthUser } from '@libs/common';
import {
  ChatGroupMessagesService,
  CreateChatGroupMessageDto,
} from 'libs/data-access-chat-groups/src';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
    return this.chatGroupMessagesService.create({
      ...data,
      chatGroup: { connect: { id: chatGroupId } },
      sender: { connect: { id: user.id } },
    });
  }

  @Get()
  public findAll(
    @Param('chatGroupId') chatGroupId: string,
  ): Promise<ChatGroupMessage[]> {
    return this.chatGroupMessagesService.findAll({ chatGroupId });
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
