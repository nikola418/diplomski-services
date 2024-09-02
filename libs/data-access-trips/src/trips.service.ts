import { Injectable } from '@nestjs/common';
import { Trip, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TripsService {
  constructor(private readonly prismaService: PrismaService) {}

  private static readonly include: Prisma.TripInclude = {};
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

  public findAll(where?: Prisma.TripWhereInput): Promise<Trip[]> {
    return this.prismaService.trip.findMany({ where });
  }

  public findOne(where: Prisma.TripWhereUniqueInput): Promise<Trip> {
    return this.prismaService.trip.findUniqueOrThrow({ where });
  }

  public update(
    where: Prisma.TripWhereUniqueInput,
    data: Prisma.TripUpdateInput,
  ): Promise<Trip> {
    return this.prismaService.trip.update({ where, data });
  }

  public remove(where: Prisma.TripWhereUniqueInput): Promise<Trip> {
    return this.prismaService.trip.delete({ where });
  }
}
