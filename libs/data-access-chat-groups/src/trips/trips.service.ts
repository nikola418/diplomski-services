import { Injectable } from '@nestjs/common';
import { ChatGroupTrip, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TripsService {
  constructor(private readonly prismaService: PrismaService) {}

  private static readonly include: Prisma.ChatGroupTripInclude = {};
  private static readonly orderBy: Prisma.ChatGroupOrderByWithRelationInput =
    {};

  public create(data: Prisma.ChatGroupTripCreateInput): Promise<ChatGroupTrip> {
    return this.prismaService.chatGroupTrip.create({ data });
  }

  public findAll(
    where?: Prisma.ChatGroupTripWhereInput,
  ): Promise<ChatGroupTrip[]> {
    return this.prismaService.chatGroupTrip.findMany({ where });
  }

  public findOne(
    where: Prisma.ChatGroupTripWhereUniqueInput,
  ): Promise<ChatGroupTrip> {
    return this.prismaService.chatGroupTrip.findUniqueOrThrow({ where });
  }

  public update(
    where: Prisma.ChatGroupTripWhereUniqueInput,
    data: Prisma.ChatGroupTripUpdateInput,
  ): Promise<ChatGroupTrip> {
    return this.prismaService.chatGroupTrip.update({ where, data });
  }

  public remove(
    where: Prisma.ChatGroupTripWhereUniqueInput,
  ): Promise<ChatGroupTrip> {
    return this.prismaService.chatGroupTrip.delete({ where });
  }
}
