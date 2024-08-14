import { GridFsMulterConfigService } from '@libs/data-access-files';
import { DataAccessPostsModule } from '@libs/data-access-posts';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from 'nestjs-prisma';
import { PostsController } from './posts.controller';
import { FavoritePostsModule } from './favorite-posts/favorite-posts.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    {
      module: DataAccessPostsModule,
    },
    MulterModule.registerAsync({ useClass: GridFsMulterConfigService }),
    FavoritePostsModule,
    RouterModule.register([
      { path: 'users/:userId', module: FavoritePostsModule },
    ]),
  ],
  controllers: [PostsController],
})
export class PostsModule {}
