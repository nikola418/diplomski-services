import { Injectable } from '@nestjs/common';
import { ChatGroup, Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { QueryChatGroupsDto } from './dto';
import { PaginatedResult, PaginateFunction, paginator } from '@libs/common';

@Injectable()
export class ChatGroupsService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly paginator: PaginateFunction = paginator({
    perPage: 12,
  });

  private static readonly include: Prisma.ChatGroupInclude = {
    chatGroupMembers: { include: { memberUser: true } },
    chatGroupTrips: { include: { post: true } },
    chatGroupMessages: {
      include: { senderUser: true },
      take: 1,
      orderBy: { updatedAt: 'desc' },
    },
  };

  private static readonly orderBy: Prisma.ChatGroupOrderByWithRelationInput = {
    updatedAt: 'desc',
  };

  public create(data: Prisma.ChatGroupCreateInput): Promise<ChatGroup> {
    return this.prismaService.chatGroup.create({
      data,
    });
  }

  public paginate(
    filters: QueryChatGroupsDto,
    user: User,
  ): Promise<PaginatedResult<ChatGroup>> {
    return this.paginator<ChatGroup, Prisma.ChatGroupFindManyArgs>(
      this.prismaService.chatGroup,
      {
        where: {
          name: { contains: filters.name, mode: 'insensitive' },
          OR: [
            { chatGroupMembers: { some: { userId: user.id } } },
            { ownerUserId: user.id },
          ],
        },
        include: ChatGroupsService.include,
        orderBy: ChatGroupsService.orderBy,
      },
      filters.pagination,
    );
  }

  public findAll(where?: Prisma.ChatGroupWhereInput): Promise<ChatGroup[]> {
    return this.prismaService.chatGroup.findMany({
      where,
      include: ChatGroupsService.include,
      orderBy: ChatGroupsService.orderBy,
    });
  }

  public findOne(where: Prisma.ChatGroupWhereUniqueInput): Promise<ChatGroup> {
    return this.prismaService.chatGroup.findUniqueOrThrow({
      where,
      include: ChatGroupsService.include,
    });
  }

  public update(
    where: Prisma.ChatGroupWhereUniqueInput,
    data: Prisma.ChatGroupUpdateInput,
  ): Promise<ChatGroup> {
    return this.prismaService.chatGroup.update({ where, data });
  }

  public remove(where: Prisma.ChatGroupWhereUniqueInput): Promise<ChatGroup> {
    return this.prismaService.chatGroup.delete({ where });
  }
}
