import { AUTH_SERVICE, AuthUser, JwtAuthGuard } from '@libs/common';
import {
  ChatGroupMessagesService,
  CreateChatGroupMessageDto,
} from 'libs/data-access-chat-groups/src';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Logger,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientRMQ, RmqRecordBuilder } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { parse } from 'cookie';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { AllExceptionsFilter } from './socket-exception.filter';

@UseGuards(JwtAuthGuard)
@UsePipes(ValidationPipe)
@UseFilters(AllExceptionsFilter)
@WebSocketGateway({ transports: ['websocket'] })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(AUTH_SERVICE) private readonly authProxy: ClientRMQ,
    private readonly chatGroupMessagesService: ChatGroupMessagesService,
  ) {}
  private readonly logger = new Logger(ChatsGateway.name);

  @WebSocketServer()
  server: Server;

  private async getUserFromClientSocket(client: Socket): Promise<User> {
    const bearer = client.request.headers.authorization;
    const cookie = (client.request as any).cookies?.Authorization;

    if (!bearer && !cookie) throw new WsException(new UnauthorizedException());

    const user = await firstValueFrom(
      this.authProxy
        .send<User>(
          { cmd: 'authorize' },
          new RmqRecordBuilder().setData({ bearer, cookie }).build(),
        )
        .pipe(
          catchError((err) => {
            this.logger.error(err);

            return throwError(
              () => new WsException(new UnauthorizedException()),
            );
          }),
        ),
    );

    return user;
  }

  afterInit(server: Server) {
    server.engine.on('headers', (headers, req) => {
      if (!req.headers.cookie && !req.headers.authorization) return;

      if (req.headers.cookie) req.cookies = parse(req.headers.cookie);
    });
  }

  async handleConnection(client: Socket) {
    try {
      const user = await this.getUserFromClientSocket(client);

      await this.cacheManager.set(user?.id, client.id);
    } catch (error) {
      this.logger.error(error);
      client.disconnect(error);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const user = await this.getUserFromClientSocket(client);

      await this.cacheManager.del(user?.id);
    } catch (error) {
      client.disconnect();
    }
  }

  @SubscribeMessage('newMessage')
  public async handleNewMessage(
    @ConnectedSocket() client: Socket,
    @AuthUser() user: User,
    @MessageBody() data: { chatGroupId: string } & CreateChatGroupMessageDto,
  ) {
    const message = await this.chatGroupMessagesService.create({
      chatGroup: { connect: { id: data.chatGroupId } },
      sender: { connect: { id: user.id } },
      text: data.text,
    });

    const receiverGroup = await this.cacheManager.get<string>(data.chatGroupId);
    this.server.to(receiverGroup).emit('newMessage', message);
    return message;
  }
}
