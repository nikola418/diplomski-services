import { Module } from '@nestjs/common';
import { DataAccessChatGroupsModule } from 'libs/data-access-chat-groups/src';
import { ChatGroupMessagesModule } from './messages/chat-group-messages.module';
import { ChatsGateway } from './chats.gateway';
import { ChatsGroupsController } from './chat-groups.controller';
import { AUTH_SERVICE, JwtAuthGuard } from '@libs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CaslModule } from 'nest-casl';
import { permissions } from './permissions';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { TripsModule } from './trips/trips.module';

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
    RouterModule.register([
      {
        path: 'chat-groups/:chatGroupId',
        children: [
          {
            path: 'messages',
            module: ChatGroupMessagesModule,
          },
          { path: 'trips', module: TripsModule },
        ],
      },
    ]),
    ChatGroupMessagesModule,
    TripsModule,
  ],
  controllers: [ChatsGroupsController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, ChatsGateway],
})
export class ChatGroupsModule {}
