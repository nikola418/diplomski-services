import { TripEntity } from '@libs/data-access-trips';
import { ChatGroup } from '@prisma/client';
import { ChatGroupMessageEntity } from '../messages';
import { ChatGroupMemberEntity } from './chat-group-member.entity';

export class ChatGroupEntity implements ChatGroup {
  constructor(partial: Partial<ChatGroupEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  name: string;
  ownerUserId: string;
  avatarImageKey: string;
  createdAt: Date;
  updatedAt: Date;

  chatGroupMessages?: ChatGroupMessageEntity[];
  chatGroupMembers?: ChatGroupMemberEntity[];
  trips?: TripEntity[];
}
