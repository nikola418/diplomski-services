import { FavoritePost } from '@prisma/client';

export class FavoritePostEntity implements FavoritePost {
  constructor(partial: Partial<FavoritePostEntity>) {
    Object.assign(this, partial);
  }

  postId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
