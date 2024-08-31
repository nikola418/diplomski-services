import { FavoritePostEntity } from '@libs/data-access-posts';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Post } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class PostEntity implements Post {
  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  title: string;
  description: string;
  averageRating: number;
  ratingsCount: number;
  @ApiProperty({ enum: $Enums.ActivityTag, isArray: true })
  activityTags: $Enums.ActivityTag[];
  @ApiProperty({ enum: $Enums.NearbyTag, isArray: true })
  nearbyTags: $Enums.NearbyTag[];
  imageKeys: string[];
  locationLat: number;
  locationLong: number;
  createdAt: Date;
  updatedAt: Date;

  isFavoredByUser?: boolean;

  // @Type(() => FavoritePostEntity)
  // @ApiProperty({ isArray: true, type: FavoritePostEntity })
  @Exclude()
  favoritePosts?: FavoritePostEntity[];
}
