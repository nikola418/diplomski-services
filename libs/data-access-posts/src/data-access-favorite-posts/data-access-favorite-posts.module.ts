import { Module } from '@nestjs/common';
import { FavoritePostsService } from './favorite-posts.service';

@Module({ providers: [FavoritePostsService], exports: [FavoritePostsService] })
export class DataAccessFavoritePostsModule {}
