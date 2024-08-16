import { GridFsMulterConfigService } from '@libs/data-access-files';
import { DataAccessPostsModule } from '@libs/data-access-posts';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { FavoritePostsModule } from './favorite-posts/favorite-posts.module';
import { PostsController } from './posts.controller';

@Module({
  imports: [
    DataAccessPostsModule,
    MulterModule.registerAsync({ useClass: GridFsMulterConfigService }),
    FavoritePostsModule,
    RouterModule.register([
      { path: 'users/:userId', module: FavoritePostsModule },
    ]),
  ],
  controllers: [PostsController],
})
export class PostsModule {}
