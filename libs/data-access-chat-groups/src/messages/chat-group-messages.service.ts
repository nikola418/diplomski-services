import { Injectable } from '@nestjs/common';
import { ChatGroupMessage, Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateChatGroupMessageDto, QueryChatMessagesDto } from './dto';
import { paginatorFactory } from '@libs/core/factories';
import { PaginateFunction, PaginatedResult } from '@libs/core';

@Injectable()
export class ChatGroupMessagesService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly paginator: PaginateFunction = paginatorFactory({
    perPage: 12,
  });
  private static readonly include: Prisma.ChatGroupMessageInclude = {
    sender: true,
  };
  private static readonly orderBy: Prisma.ChatGroupMessageOrderByWithRelationInput =
    { createdAt: 'desc' };

  public async create(
    chatGroupId: string,
    dto: CreateChatGroupMessageDto,
    user: User,
    include?: Prisma.ChatGroupMessageInclude,
  ): Promise<ChatGroupMessage> {
    return this.prismaService.$transaction(async (tx) => {
      await tx.chatGroup.update({
        where: { id: chatGroupId },
        data: { updatedAt: new Date() },
      });
      return tx.chatGroupMessage.create({
        data: {
          chatGroup: { connect: { id: chatGroupId } },
          sender: { connect: { id: user.id } },
          text: dto.text,
        },
        include: include ?? ChatGroupMessagesService.include,
      });
    });
  }

  public paginate(
    chatGroupId: string,
    filters: QueryChatMessagesDto,
  ): Promise<PaginatedResult<ChatGroupMessage>> {
    return this.paginator<
      ChatGroupMessage,
      Prisma.ChatGroupMessageFindManyArgs
    >(
      this.prismaService.chatGroupMessage,
      {
        where: { chatGroupId },
        include: ChatGroupMessagesService.include,
        orderBy: ChatGroupMessagesService.orderBy,
      },
      filters.pagination,
    );
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
