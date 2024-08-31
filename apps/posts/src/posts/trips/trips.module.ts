import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';
import { DataAccessChatGroupsModule } from '@libs/data-access-chat-groups';
import { ExtendedPrismaClient } from '@libs/data-access-posts';
import { PrismaService, CustomPrismaService } from 'nestjs-prisma';

@Module({
  imports: [
    CaslModule.forFeature({ permissions }),
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
      module: DataAccessChatGroupsModule,
    },
  ],
  controllers: [TripsController],
})
export class TripsModule {}
