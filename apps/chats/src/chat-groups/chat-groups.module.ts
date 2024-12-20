import { JwtAuthGuard } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { CaslModule } from 'nest-casl';
import { ChatsGroupsController } from './chat-groups.controller';
import { ChatsGateway } from './chats.gateway';
import { ChatGroupMessagesModule } from './messages/chat-group-messages.module';
import { permissions } from './permissions';
import { DataAccessFilesModule } from '@libs/data-access-files';
import { AUTH_SERVICE } from '@libs/core';
import { DataAccessChatGroupsModule } from '@libs/data-access-chat-groups';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('AUTH_HOST'),
            port: configService.getOrThrow<number>('AUTH_PORT'),
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
