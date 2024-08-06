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
  activityTags: $Enums.ActivityTag[];
  nearbyTags: $Enums.NearbyTag[];
  imageUrls: string[];
  locationLat: number;
  locationLong: number;
  createdAt: Date;
  updatedAt: Date;
}
