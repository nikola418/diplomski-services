import { DataAccessFilesModule } from '@libs/data-access-files';
import {
  DataAccessLocationsModule,
  ExtendedPrismaClient,
} from '@libs/data-access-locations';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CaslModule } from 'nest-casl';
import { CustomPrismaService, PrismaService } from 'nestjs-prisma';
import { LocationsController } from './locations.controller';
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
      module: DataAccessLocationsModule,
    },
    DataAccessFilesModule,
    MulterModule.register(),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [LocationsController],
})
export class LocationsModule {}
