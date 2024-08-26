import { AUTH_SERVICE } from '@libs/common';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private configService: ConfigService;
  private reflector;
  private authClient: ClientProxy;

  constructor(app: INestApplicationContext) {
    super(app);
    this.configService = app.get(ConfigService);
    this.reflector = app.get(Reflector);
    this.authClient = app.get(AUTH_SERVICE);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: this.configService.getOrThrow('REDIS_URL'),
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server: Server = super.createIOServer(port, {
      ...options,
      path: '/chats',
      cors: {
        credentials: true,
        origin: [
          'http://localhost:8100',
          'http://192.168.1.108:8100',
          'http://172.18.0.1:8100',
        ],
      },
    } satisfies ServerOptions);

    server.adapter(this.adapterConstructor);
    return server;
  }
}
