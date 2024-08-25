import { Injectable } from '@nestjs/common';
import { ChatGroup, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChatGroupsService {
  constructor(private readonly prismaService: PrismaService) {}

  private static readonly include: Prisma.ChatGroupInclude = {
    chatGroupMembers: { include: { memberUser: true } },
    chatGroupMessages: { take: 1, orderBy: { updatedAt: 'desc' } },
  };

  private static readonly orderBy: Prisma.ChatGroupOrderByWithRelationInput = {
    updatedAt: 'desc',
  };

  public create(data: Prisma.ChatGroupCreateInput): Promise<ChatGroup> {
    return this.prismaService.chatGroup.create({
      data,
    });
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
