import { Injectable } from '@nestjs/common';
import { ChatGroupMessage, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChatGroupMessagesService {
  constructor(private readonly prismaService: PrismaService) {}
  private static readonly include: Prisma.ChatGroupMessageInclude = {
    senderUser: true,
  };
  private static readonly orderBy: Prisma.ChatGroupMessageOrderByWithRelationInput =
    { createdAt: 'asc' };

  public create(
    data: Prisma.ChatGroupMessageCreateInput,
    include?: Prisma.ChatGroupMessageInclude,
  ): Promise<ChatGroupMessage> {
    return this.prismaService.chatGroupMessage.create({
      data,
      include: include ?? ChatGroupMessagesService.include,
    });
  }

  public findAll(
    where?: Prisma.ChatGroupMessageWhereInput,
    include?: Prisma.ChatGroupMessageInclude,
    orderBy?: Prisma.ChatGroupMessageOrderByWithRelationInput,
  ): Promise<ChatGroupMessage[]> {
    return this.prismaService.chatGroupMessage.findMany({
      where,
      include: include ?? ChatGroupMessagesService.include,
      orderBy: orderBy ?? ChatGroupMessagesService.orderBy,
    });
  }

  public findOne(
    where: Prisma.ChatGroupMessageWhereUniqueInput,
  ): Promise<ChatGroupMessage> {
    return this.prismaService.chatGroupMessage.findUniqueOrThrow({ where });
  }

  public update(
    where: Prisma.ChatGroupMessageWhereUniqueInput,
    data: Prisma.ChatGroupMessageUpdateInput,
  ): Promise<ChatGroupMessage> {
    return this.prismaService.chatGroupMessage.update({ where, data });
  }

  public remove(
    where: Prisma.ChatGroupMessageWhereUniqueInput,
  ): Promise<ChatGroupMessage> {
    return this.prismaService.chatGroupMessage.delete({ where });
  }
}
