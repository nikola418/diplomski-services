import { Injectable } from '@nestjs/common';
import { ChatGroupMessage, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChatGroupMessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  public create(
    data: Prisma.ChatGroupMessageCreateInput,
  ): Promise<ChatGroupMessage> {
    return this.prismaService.chatGroupMessage.create({ data });
  }
}
