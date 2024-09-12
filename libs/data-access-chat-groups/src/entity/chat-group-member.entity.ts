import { UserEntity } from '@libs/data-access-users';
import { ChatGroupMember } from '@prisma/client';
import { ChatGroupEntity } from './chat-group.entity';

export class ChatGroupMemberEntity implements ChatGroupMember {
  constructor(partial: Partial<ChatGroupMemberEntity>) {
    Object.assign(this, partial);
  }

  chatGroupId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  memberUser: UserEntity;
  chatGroup: ChatGroupEntity;
}
