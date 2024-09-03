import {
  DataAccessFilesModule,
  GridFsMulterConfigService,
} from '@libs/data-access-files';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import {
  DataAccessLocationsModule,
  ExtendedPrismaClient,
} from 'libs/data-access-locations/src';
import { CaslModule } from 'nest-casl';
import { CustomPrismaService, PrismaService } from 'nestjs-prisma';
import { LocationsController } from './locations.controller';
import { permissions } from './permissions';
import { MongooseModule } from '@nestjs/mongoose';

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
    MongooseModule.forFeature(),
    DataAccessFilesModule,
    MulterModule.register(),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [LocationsController],
})
export class LocationsModule {}
