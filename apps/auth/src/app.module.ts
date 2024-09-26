import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards';
import { join } from 'path';

console.log(join(__dirname, '../../../apps/auth/src/.env'));

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'nigga.env',
      cache: true,
      isGlobal: true,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
