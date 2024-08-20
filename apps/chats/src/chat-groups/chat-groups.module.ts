import { Module } from '@nestjs/common';
import { DataAccessChatGroupsModule } from 'libs/data-access-chat-groups/src';
import { ChatGroupMessagesModule } from './chat-group-messages/chat-group-messages.module';
import { ChatsGateway } from './chats.gateway';
import { ChatsGroupsController } from './chat-groups.controller';
import { AUTH_SERVICE, JwtAuthGuard } from '@libs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RMQ_URL')],
            queue: 'auth',
          },
        }),
        inject: [ConfigService],
      },
    ]),
    { module: DataAccessChatGroupsModule, global: true },
    CaslModule.forFeature({ permissions }),
    ChatGroupMessagesModule,
  ],
  controllers: [ChatsGroupsController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, ChatsGateway],
})
export class ChatGroupsModule {}
