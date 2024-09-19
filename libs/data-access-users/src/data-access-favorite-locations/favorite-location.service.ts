import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FavoriteLocationService {
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
      include: FavoriteLocationService.include,
    });
  }

  findAll(where?: Prisma.FavoriteLocationWhereInput) {
    return this.prismaService.favoriteLocation.findMany({
      where,
      include: FavoriteLocationService.include,
      orderBy: FavoriteLocationService.orderBy,
    });
  }

  findOne(where: Prisma.FavoriteLocationWhereUniqueInput) {
    return this.prismaService.favoriteLocation.findUniqueOrThrow({
      where,
      include: FavoriteLocationService.include,
    });
  }

  remove(where: Prisma.FavoriteLocationWhereUniqueInput) {
    return this.prismaService.favoriteLocation.delete({
      where,
      include: FavoriteLocationService.include,
    });
  }
}
