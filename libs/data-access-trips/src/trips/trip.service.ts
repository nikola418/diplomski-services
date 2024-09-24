import { PaginatedResult, PaginateFunction, paginator } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { Prisma, Trip, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { QueryTripsDto } from './dto';

@Injectable()
export class TripService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly paginator: PaginateFunction = paginator({
    perPage: 12,
  });

  private static readonly include: Prisma.TripInclude = {
    location: true,
    tripAttendances: { include: { user: true } },
  };
  private static readonly orderBy: Prisma.TripOrderByWithRelationInput = {};

  public create(data: Prisma.TripCreateInput): Promise<Trip> {
    return this.prismaService.trip.create({ data });
  }

  public createMany(
    data: Prisma.TripCreateManyInput | Prisma.TripCreateManyInput[],
  ): Promise<Trip[]> {
    return this.prismaService.trip.createManyAndReturn({
      data,
      skipDuplicates: true,
    });
  }

  public paginate(
    filters: QueryTripsDto,
    user: User,
  ): Promise<PaginatedResult<Trip>> {
    return this.paginator<Trip, Prisma.TripFindManyArgs>(
      this.prismaService.trip,
      {
        where: {
          chatGroup: {
            OR: [
              {
                chatGroupMembers: { some: { userId: user.id } },
              },
              {
                ownerUserId: user.id,
              },
            ],
          },
          tripStatus: filters.tripStatus,
          chatGroupId: filters.chatGroupId,
          locationId: filters.locationId,
        },
        include: TripService.include,
      },
      filters.pagination,
    );
  }

  public findAll(
    where?: Prisma.TripWhereInput,
    orderBy?: Prisma.TripOrderByWithRelationInput,
    include: Prisma.TripInclude = TripService.include,
  ): Promise<Trip[]> {
    return this.prismaService.trip.findMany({ where, include, orderBy });
  }

  public findOne(
    where: Prisma.TripWhereUniqueInput,
    include = TripService.include,
  ): Promise<Trip> {
    return this.prismaService.trip.findUniqueOrThrow({ where, include });
  }

  public update(
    where: Prisma.TripWhereUniqueInput,
    data: Prisma.TripUpdateInput,
    include: Prisma.TripInclude = TripService.include,
  ): Promise<Trip> {
    return this.prismaService.trip.update({ where, data, include });
  }

  public async updateMany(
    where: Prisma.TripWhereInput,
    data: Prisma.TripUpdateInput,
  ): Promise<Prisma.BatchPayload> {
    return this.prismaService.trip.updateMany({ where, data });
  }

  public remove(where: Prisma.TripWhereUniqueInput): Promise<Trip> {
    return this.prismaService.trip.delete({ where });
  }
}
