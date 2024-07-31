import { Module } from '@nestjs/common';
import { DataAccessPostsService } from './data-access-posts.service';

@Module({
  providers: [DataAccessPostsService],
  exports: [DataAccessPostsService],
})
export class DataAccessPostsModule {}
