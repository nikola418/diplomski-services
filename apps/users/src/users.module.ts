import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DataAccessUsersModule, UsersService } from '@app/data-access-users';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRoot(),
    { module: DataAccessUsersModule, imports: [PrismaModule] },
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
