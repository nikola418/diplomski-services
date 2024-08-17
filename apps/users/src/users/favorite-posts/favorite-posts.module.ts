import { Module } from '@nestjs/common';
import { FavoritePostsController } from './favorite-posts.controller';
import { DataAccessFavoritePostsModule } from '@libs/data-access-posts';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';

@Module({
  imports: [
    CaslModule.forFeature({ permissions }),
    DataAccessFavoritePostsModule,
  ],
  controllers: [FavoritePostsController],
})
export class FavoritePostsModule {}
