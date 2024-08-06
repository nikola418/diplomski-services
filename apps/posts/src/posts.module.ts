import { DataAccessPostsModule } from '@libs/data-access-posts';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from 'nestjs-prisma';
import { PostsController } from './posts.controller';
import { GridFsMulterConfigService } from '@libs/data-access-files';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    { imports: [PrismaModule.forRoot()], module: DataAccessPostsModule },
    MulterModule.registerAsync({ useClass: GridFsMulterConfigService }),
  ],
  controllers: [PostsController],
})
export class PostsModule {}
