import { DataAccessFilesModule } from '@libs/data-access-files';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';

@Module({
  imports: [
    { imports: [MongooseModule.forFeature()], module: DataAccessFilesModule },
  ],
  controllers: [FilesController],
})
export class FilesModule {}
