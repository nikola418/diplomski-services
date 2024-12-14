import { FavoriteLocationEntity } from '@libs/data-access-users';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Location } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { NearbyEntity } from './nearby.entity';

export class LocationEntity implements Location {
  constructor(partial: Partial<LocationEntity>) {
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
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;

  @Expose()
  isFavoredByUser?: boolean;

  @Exclude()
  favoriteLocations?: FavoriteLocationEntity[];

  nearbys?: NearbyEntity[];
}
