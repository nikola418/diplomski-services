import { ChatGroup } from '@prisma/client';
import { ChatGroupMessageEntity } from '../messages/entity';
import { TripEntity } from '../../../../posts/src/posts/trips/entities';

export class ChatGroupEntity implements ChatGroup {
  constructor(partial: Partial<ChatGroupEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  name: string;
  ownerUserId: string;
  memberUserIds: string[];
  createdAt: Date;
  updatedAt: Date;

  chatGroupMessages?: ChatGroupMessageEntity[];
  chatGroupTrips?: TripEntity[];
}
