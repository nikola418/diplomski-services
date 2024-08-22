import { Module } from '@nestjs/common';
import { ChatGroupMessagesController } from './chat-group-messages.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [ChatGroupMessagesController],
})
export class ChatGroupMessagesModule {}
