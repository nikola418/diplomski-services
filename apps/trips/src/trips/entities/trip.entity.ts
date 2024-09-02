import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Trip } from '@prisma/client';
import { LocationEntity } from '../../../../locations/src/locations/entity';
import { ChatGroupEntity } from 'apps/chats/src/chat-groups/entity';

export class TripEntity implements Trip {
  constructor(partial: Partial<TripEntity>) {
    Object.assign(this, partial);
  }
  id: string;
  chatGroupId: string;
  locationId: string;
  @ApiProperty({ enum: $Enums.TripStatus })
  tripStatus: $Enums.TripStatus;
  name: string;
  scheduledDateTime: Date;

  location?: LocationEntity;
  chatGroup?: ChatGroupEntity[];
}
