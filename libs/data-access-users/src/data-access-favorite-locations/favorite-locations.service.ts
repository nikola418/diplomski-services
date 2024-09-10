import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FavoriteLocationsService {
  constructor(private readonly prismaService: PrismaService) {}

  private static readonly include: Prisma.FavoriteLocationInclude = {
    location: true,
  };
  private static readonly orderBy: Prisma.FavoriteLocationOrderByWithRelationInput =
    {
      createdAt: 'desc',
    };

  public create(data: Prisma.FavoriteLocationCreateInput) {
    return this.prismaService.favoriteLocation.create({
      data,
      include: FavoriteLocationsService.include,
    });
  }

  findAll(where?: Prisma.FavoriteLocationWhereInput) {
    return this.prismaService.favoriteLocation.findMany({
      where,
      include: FavoriteLocationsService.include,
      orderBy: FavoriteLocationsService.orderBy,
    });
  }

  findOne(where: Prisma.FavoriteLocationWhereUniqueInput) {
    return this.prismaService.favoriteLocation.findUniqueOrThrow({
      where,
      include: FavoriteLocationsService.include,
    });
  }

  remove(where: Prisma.FavoriteLocationWhereUniqueInput) {
    return this.prismaService.favoriteLocation.delete({
      where,
      include: FavoriteLocationsService.include,
    });
  }
}
