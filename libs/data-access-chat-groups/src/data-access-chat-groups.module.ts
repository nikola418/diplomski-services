import { Module } from '@nestjs/common';
import { ChatGroupsService } from './chat-groups.service';
import { ChatGroupMessagesService } from './chat-group-messages.service';

@Module({
  providers: [ChatGroupMessagesService, ChatGroupsService],
  exports: [ChatGroupMessagesService, ChatGroupsService],
})
export class DataAccessChatGroupsModule {}
