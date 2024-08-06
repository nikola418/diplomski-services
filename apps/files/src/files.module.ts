import { DataAccessFilesModule } from '@libs/data-access-files';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    { imports: [MongooseModule], module: DataAccessFilesModule },
  ],
  controllers: [FilesController],
})
export class FilesModule {}
