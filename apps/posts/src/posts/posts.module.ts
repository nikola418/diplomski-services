import { GridFsMulterConfigService } from '@libs/data-access-files';
import { DataAccessPostsModule } from '@libs/data-access-posts';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PostsController } from './posts.controller';

@Module({
  imports: [
    DataAccessPostsModule,
    MulterModule.registerAsync({ useClass: GridFsMulterConfigService }),
  ],
  controllers: [PostsController],
})
export class PostsModule {}
