import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    PostsModule,
  ],
})
export class AppModule {}
