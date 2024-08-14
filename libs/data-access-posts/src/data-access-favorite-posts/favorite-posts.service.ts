import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FavoritePostsService {
  constructor(private readonly prismaService: PrismaService) {}

  private static readonly include: Prisma.FavoritePostInclude = { post: true };
  private static readonly orderBy: Prisma.FavoritePostOrderByWithRelationInput =
    {
      createdAt: 'desc',
    };

  public create(data: Prisma.FavoritePostCreateInput) {
    return this.prismaService.favoritePost.create({
      data,
      include: FavoritePostsService.include,
    });
  }

  findAll(where?: Prisma.FavoritePostWhereInput) {
    return this.prismaService.favoritePost.findMany({
      where,
      include: FavoritePostsService.include,
      orderBy: FavoritePostsService.orderBy,
    });
  }

  findOne(where: Prisma.FavoritePostWhereUniqueInput) {
    return this.prismaService.favoritePost.findUniqueOrThrow({
      where,
      include: FavoritePostsService.include,
    });
  }

  remove(where: Prisma.FavoritePostWhereUniqueInput) {
    return this.prismaService.favoritePost.delete({
      where,
      include: FavoritePostsService.include,
    });
  }
}
