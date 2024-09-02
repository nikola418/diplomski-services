import { ChatGroup } from '@prisma/client';
import { ChatGroupMessageEntity } from '../messages/entity';
import { TripEntity } from '../../../../trips/src/trips/entities';

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
  trips?: TripEntity[];
}
