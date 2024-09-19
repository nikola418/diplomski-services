import { PaginatedResult, PaginateFunction, paginator } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { Location, Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { QueryLocationsDto } from './dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prismaService: PrismaService) {}
  public static readonly orderBy: Prisma.LocationOrderByWithRelationInput = {
    createdAt: 'desc',
  };
  public static readonly include: Prisma.LocationInclude = {};
  private readonly paginator: PaginateFunction = paginator({
    perPage: 12,
  });

  public create(data: Prisma.LocationCreateInput): Promise<Location> {
    return this.prismaService.location.create({ data });
  }

  public paginate(
    filters: QueryLocationsDto,
    user: User,
  ): Promise<PaginatedResult<Location>> {
    console.log({
      locationLat: filters.range?.lat.lower,
      locationLong: filters.range?.lng.lower,
    });
    return this.paginator<Location, Prisma.LocationFindManyArgs>(
      this.prismaService.location,
      {
        where: {
          activityTags: filters.activityTags && {
            hasEvery: filters.activityTags,
          },
          nearbyTags: filters.nearbyTags && { hasEvery: filters.nearbyTags },
          title: { contains: filters.title, mode: 'insensitive' },
          AND: [
            {
              locationLat: filters.range?.lat.upper,
              locationLong: filters.range?.lng.upper,
            },
            {
              NOT: {
                locationLat: filters.range?.lat.lower,
                locationLong: filters.range?.lng.lower,
              },
            },
          ],
        },
        include: {
          favoriteLocations: { where: { userId: user.id } },
        },
      },
      filters.pagination,
    );
  }

  public findAll({
    where,
    include = LocationsService.include,
    orderBy = LocationsService.orderBy,
  }: Prisma.LocationFindManyArgs): Promise<Location[]> {
    return this.prismaService.location.findMany({
      where,
      include,
      orderBy,
    });
  }

  public findOne(
    where: Prisma.LocationWhereUniqueInput,
    include?: Prisma.LocationInclude,
  ): Promise<Location> {
    return this.prismaService.location.findUniqueOrThrow({
      where,
      include: include ?? LocationsService.include,
    });
  }

  public update(
    where: Prisma.LocationWhereUniqueInput,
    data: Prisma.LocationUpdateInput,
  ): Promise<Location> {
    return this.prismaService.location.update({ where, data });
  }

  public remove(where: Prisma.LocationWhereUniqueInput): Promise<Location> {
    return this.prismaService.location.delete({ where });
  }
}
