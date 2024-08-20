import { ChatGroup } from '@prisma/client';
import { ChatGroupMessageEntity } from '../chat-group-messages/entity';

export class ChatGroupEntity implements ChatGroup {
  constructor(partial: Partial<ChatGroupEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  name: string;
  ownerUserId: string;
  postId: string;
  memberUserIds: string[];
  createdAt: Date;
  updatedAt: Date;

  chatGroupMessages?: ChatGroupMessageEntity[];
}
