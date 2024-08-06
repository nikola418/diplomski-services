import { GridFsMulterConfigService } from '@libs/data-access-files';
import { DataAccessUsersModule } from '@libs/data-access-users';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from 'nestjs-prisma';
import { UsersController } from './users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    { imports: [PrismaModule.forRoot()], module: DataAccessUsersModule },
    MulterModule.registerAsync({ useClass: GridFsMulterConfigService }),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
