import { Module } from '@nestjs/common';
import { ChatGroupsService } from './chat-groups.service';
import { ChatGroupMessagesService } from './messages';
import { TripsService } from './trips';

@Module({
  providers: [ChatGroupMessagesService, ChatGroupsService, TripsService],
  exports: [ChatGroupMessagesService, ChatGroupsService, TripsService],
})
export class DataAccessChatGroupsModule {}
