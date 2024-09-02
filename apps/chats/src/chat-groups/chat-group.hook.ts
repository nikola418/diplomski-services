import { ChatGroupsService } from 'libs/data-access-chat-groups/src';
import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { ChatGroupEntity } from './entity';

@Injectable()
export class ChatGroupHook
  implements SubjectBeforeFilterHook<ChatGroupEntity, Request>
{
  constructor(private readonly chatGroupsService: ChatGroupsService) {}

  async run({ params }: Request) {
    const chatGroup = await this.chatGroupsService.findOne({
      id: params.groupId,
    });
    return new ChatGroupEntity(chatGroup);
  }
}
