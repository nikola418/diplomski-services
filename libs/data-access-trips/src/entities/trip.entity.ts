import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Trip } from '@prisma/client';
import { ChatGroupEntity } from '@libs/data-access-chat-groups';
import { LocationEntity } from '@libs/data-access-locations';

export class TripEntity implements Trip {
  constructor(partial: Partial<TripEntity>) {
    Object.assign(this, partial);
  }
  id: string;
  chatGroupId: string;
  locationId: string;
  creatorUserId: string;
  @ApiProperty({ enum: $Enums.TripStatus })
  tripStatus: $Enums.TripStatus;
  name: string;
  scheduledDateTime: Date;

  location?: LocationEntity;
  chatGroup?: ChatGroupEntity[];
}
