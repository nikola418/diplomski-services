import { GridFsMulterConfigService } from '@libs/data-access-files';
import {
  DataAccessPostsModule,
  ExtendedPrismaClient,
} from '@libs/data-access-posts';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PostsController } from './posts.controller';
import { CustomPrismaService, PrismaService } from 'nestjs-prisma';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';
import { TripsModule } from './trips/trips.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    {
      providers: [
        {
          provide: PrismaService,
          useFactory: (
            customPrismaService: CustomPrismaService<ExtendedPrismaClient>,
          ) => customPrismaService.client,
          inject: ['CustomPrisma'],
        },
      ],
      module: DataAccessPostsModule,
    },
    MulterModule.registerAsync({ useClass: GridFsMulterConfigService }),
    CaslModule.forFeature({ permissions }),
    RouterModule.register([
      { path: 'posts/:postId/trips', module: TripsModule },
    ]),
    TripsModule,
  ],
  controllers: [PostsController],
})
export class PostsModule {}
