import { UserEntity } from '@libs/data-access-users';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { $Enums } from '@prisma/client';
import { redisStore } from 'cache-manager-redis-yet';
import { CaslModule } from 'nest-casl';
import { PrismaModule } from 'nestjs-prisma';
import { ChatGroupsModule } from './chat-groups/chat-groups.module';
import { MongoClient } from 'mongodb';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          store: await redisStore({
            url: configService.getOrThrow<string>('REDIS_URL'),
          }),
          ttl: 1 * 24 * 60 * 60 * 1000, //* One day in ms
        };
      },
      inject: [ConfigService],
    }),
    CaslModule.forRoot({
      superuserRole: $Enums.Role.Admin,
      getUserFromRequest: (req) => new UserEntity(req.user),
    }),
    ChatGroupsModule,
  ],
})
export class AppModule {}
