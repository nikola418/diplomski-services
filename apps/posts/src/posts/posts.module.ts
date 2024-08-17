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
  ],
  controllers: [PostsController],
})
export class PostsModule {}
