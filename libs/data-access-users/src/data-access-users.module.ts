import { Module } from '@nestjs/common';
import { DataAccessUsersService } from './data-access-users.service';

@Module({
  providers: [DataAccessUsersService],
  exports: [DataAccessUsersService],
})
export class DataAccessUsersModule {}
