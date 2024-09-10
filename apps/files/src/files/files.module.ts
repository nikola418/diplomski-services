import { DataAccessFilesModule } from '@libs/data-access-files';
import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';

@Module({
  imports: [DataAccessFilesModule],
  controllers: [FilesController],
})
export class FilesModule {}
