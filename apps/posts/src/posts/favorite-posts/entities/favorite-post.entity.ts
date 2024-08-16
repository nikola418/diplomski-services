import { FavoritePost } from '@prisma/client';
import { PostEntity } from '../../entity';

export class FavoritePostEntity implements FavoritePost {
  constructor(partial: Partial<FavoritePostEntity>) {
    Object.assign(this, partial);
  }

  postId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  post?: PostEntity;
}
