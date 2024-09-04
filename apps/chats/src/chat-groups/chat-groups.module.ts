import { AUTH_SERVICE, JwtAuthGuard } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { DataAccessChatGroupsModule } from 'libs/data-access-chat-groups/src';
import { CaslModule } from 'nest-casl';
import { ChatsGroupsController } from './chat-groups.controller';
import { ChatsGateway } from './chats.gateway';
import { ChatGroupMessagesModule } from './messages/chat-group-messages.module';
import { permissions } from './permissions';
import { DataAccessFilesModule } from '@libs/data-access-files';

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
    DataAccessFilesModule,
    MulterModule.register(),
    RouterModule.register([
      {
        path: 'chat-groups/:chatGroupId',
        children: [
          {
            path: 'messages',
            module: ChatGroupMessagesModule,
          },
        ],
      },
    ]),
    ChatGroupMessagesModule,
  ],
  controllers: [ChatsGroupsController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, ChatsGateway],
})
export class ChatGroupsModule {}
