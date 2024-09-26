import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Nearby } from '@prisma/client';

export class NearbyEntity implements Nearby {
  constructor(partial: Partial<NearbyEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  locationId: string;
  @ApiProperty({ enum: $Enums.NearbyTag })
  nearbyTag: $Enums.NearbyTag;
  distance: number;
  lat: number;
  lng: number;
}
