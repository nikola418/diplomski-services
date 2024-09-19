import { DataAccessFilesModule } from '@libs/data-access-files';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';
import { UsersController } from './user.controller';

@Module({
  imports: [
    DataAccessFilesModule,
    MulterModule.register({}),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [UsersController],
})
export class UserModule {}
