import {
  ChatGroupEntity,
  ChatGroupsService,
} from '@libs/data-access-chat-groups';
import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';

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
