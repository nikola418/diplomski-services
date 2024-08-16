import { GridFsMulterConfigService } from '@libs/data-access-files';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users.controller';
import { DataAccessUsersModule } from '@libs/data-access-users';

@Module({
  imports: [
    DataAccessUsersModule,
    MulterModule.registerAsync({ useClass: GridFsMulterConfigService }),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
