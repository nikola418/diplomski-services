import { ChatGroupMember } from '@prisma/client';

export class ChatGroupMemberEntity implements ChatGroupMember {
  constructor(partial: Partial<ChatGroupMemberEntity>) {
    Object.assign(this, partial);
  }

  chatGroupId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
