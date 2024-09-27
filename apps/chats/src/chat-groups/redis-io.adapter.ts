import { cors } from '@libs/core';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private configService: ConfigService;

  constructor(app: INestApplicationContext) {
    super(app);
    this.configService = app.get(ConfigService);
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
      cors,
    } satisfies ServerOptions);

    server.adapter(this.adapterConstructor);
    return server;
  }
}
