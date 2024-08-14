import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  DataAccessFavoritePostsModule,
  FavoritePostsService,
} from './data-access-favorite-posts';

@Module({
  imports: [DataAccessFavoritePostsModule],
  providers: [PostsService, FavoritePostsService],
  exports: [PostsService, FavoritePostsService],
})
export class DataAccessPostsModule {}
