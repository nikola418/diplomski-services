import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';

@Module({
  providers: [
    {
      provide: 'MONGO_CLIENT',
      useFactory: (configService: ConfigService) =>
        new MongoClient(configService.getOrThrow('MONGO_URL')),
      inject: [ConfigService],
    },
    FilesService,
  ],
  exports: [FilesService],
})
export class DataAccessFilesModule {}
