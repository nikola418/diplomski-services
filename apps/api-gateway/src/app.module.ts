import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    PassportModule,
  ],
})
export class AppModule {}
