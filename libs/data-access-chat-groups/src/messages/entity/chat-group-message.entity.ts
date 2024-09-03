import { ChatGroupMessage } from '@prisma/client';

export class ChatGroupMessageEntity implements ChatGroupMessage {
  constructor(partial: Partial<ChatGroupMessageEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  chatGroupId: string;
  senderUserId: string;
  repliedToMessageId: string;
  tripId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
