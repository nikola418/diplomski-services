import { TripEntity } from '@libs/data-access-trips/trips';
import { UserEntity } from '@libs/data-access-users';
import { ApiProperty } from '@nestjs/swagger';
import { ChatGroup } from '@prisma/client';
import { ChatGroupMessageEntity } from '../messages';
import { ChatGroupMemberEntity } from './chat-group-member.entity';

export class ChatGroupEntity implements ChatGroup {
  constructor(partial: Partial<ChatGroupEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  name: string;
  @ApiProperty({ deprecated: true })
  ownerUserId: string;
  avatarImageKey: string;
  createdAt: Date;
  updatedAt: Date;

  chatGroupOwner?: UserEntity;
  chatGroupMessages?: ChatGroupMessageEntity[];
  chatGroupMembers?: ChatGroupMemberEntity[];
  trips?: TripEntity[];
}
