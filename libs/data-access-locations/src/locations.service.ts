import { Injectable } from '@nestjs/common';
import { Location, Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateLocationDto, QueryLocationsDto } from './dto';
import { paginatorFactory } from '@libs/core/factories';
import { PaginateFunction, PaginatedResult } from '@libs/core';

@Injectable()
export class LocationsService {
  constructor(private readonly prismaService: PrismaService) {}
  public static readonly include: Prisma.LocationInclude = {
    nearbys: true,
  };
  public static readonly orderBy: Prisma.LocationOrderByWithRelationInput = {
    createdAt: 'desc',
  };
  private readonly paginator: PaginateFunction = paginatorFactory({
    perPage: 12,
  });

  public create(dto: CreateLocationDto): Promise<Location> {
    return this.prismaService.location.create({
      data: {
        ...dto,
        nearbys: {
          createMany: {
            skipDuplicates: true,
            data: dto.nearbyTags.map((tag) => ({ nearbyTag: tag })),
          },
        },
      },
    });
  }

  public paginate(
    filters: QueryLocationsDto,
    user: User,
  ): Promise<PaginatedResult<Location>> {
    console.log(filters);
    return this.paginator<Location, Prisma.LocationFindManyArgs>(
      this.prismaService.location,
      {
        where: {
          title: { contains: filters.title, mode: 'insensitive' },
          activityTags: filters.activityTags && {
            hasEvery: filters.activityTags,
          },
          nearbyTags: filters.nearbyTags && {
            hasEvery: filters.nearbyTags,
          },
          AND: [
            {
              favoriteLocations:
                filters.isFavoredByUser === true
                  ? {
                      some: { userId: user.id },
                    }
                  : undefined,
            },
            {
              favoriteLocations:
                filters.isFavoredByUser === false
                  ? {
                      none: { userId: user.id },
                    }
                  : undefined,
            },
            {
              lat: filters.range?.lat.upper,
              lng: filters.range?.lng.upper,
            },
            {
              NOT: {
                lat: filters.range?.lat.lower,
                lng: filters.range?.lng.lower,
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
