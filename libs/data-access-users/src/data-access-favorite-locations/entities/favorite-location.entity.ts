import { FavoriteLocation } from '@prisma/client';

export class FavoriteLocationEntity implements FavoriteLocation {
  constructor(partial: Partial<FavoriteLocationEntity>) {
    Object.assign(this, partial);
  }

  locationId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
