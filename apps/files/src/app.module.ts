import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';

@Module({
  imports: [ConfigModule.forRoot({ cache: true, isGlobal: true }), FilesModule],
})
export class AppModule {}
