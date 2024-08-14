import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Post } from '@prisma/client';

export class PostEntity implements Post {
  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  title: string;
  description: string;
  averageRating: number;
  ratingsCount: number;
  @ApiProperty({ enum: $Enums.ActivityTag })
  activityTags: $Enums.ActivityTag[];
  @ApiProperty({ enum: $Enums.NearbyTag })
  nearbyTags: $Enums.NearbyTag[];
  imageKeys: string[];
  locationLat: number;
  locationLong: number;
  createdAt: Date;
  updatedAt: Date;
}
