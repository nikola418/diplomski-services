import { Module } from '@nestjs/common';
import { FavoritePostsController } from './favorite-posts.controller';
import { DataAccessFavoritePostsModule } from '@libs/data-access-posts';

@Module({
  imports: [DataAccessFavoritePostsModule],
  controllers: [FavoritePostsController],
})
export class FavoritePostsModule {}
