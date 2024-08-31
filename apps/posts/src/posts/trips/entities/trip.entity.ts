import { ApiProperty } from '@nestjs/swagger';
import { $Enums, ChatGroupTrip } from '@prisma/client';
import { PostEntity } from '../../entity';

export class TripEntity implements ChatGroupTrip {
  constructor(partial: Partial<TripEntity>) {
    Object.assign(this, partial);
  }

  chatGroupId: string;
  postId: string;
  name: string;
  @ApiProperty({ enum: $Enums.TripStatus })
  tripStatus: $Enums.TripStatus;
  scheduledDateTime: Date;

  post?: PostEntity;
  chatGroups?: any[];
}
