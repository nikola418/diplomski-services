import { PaginatedResult, PaginateFunction, paginator } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { QueryPostsDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  public static readonly orderBy: Prisma.PostOrderByWithRelationInput = {
    createdAt: 'desc',
  };
  public static readonly include: Prisma.PostInclude = { reviews: true };
  private readonly paginator: PaginateFunction = paginator({
    perPage: 12,
  });

  public create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prismaService.post.create({ data });
  }

  public paginate(
    filters: QueryPostsDto,
    user: User,
  ): Promise<PaginatedResult<Post>> {
    return this.paginator<Post, Prisma.PostFindManyArgs>(
      this.prismaService.post,
      {
        where: {
          activityTags: { hasEvery: filters.activityTags },
          nearbyTags: { hasEvery: filters.nearbyTags },
          title: { contains: filters.title, mode: 'insensitive' },
          locationLat: {
            gte: filters.range?.lat.lower,
            lte: filters.range?.lat.upper,
          },
          locationLong: {
            gte: filters.range?.lng.lower,
            lte: filters.range?.lng.upper,
          },
        },
        include: {
          ...PostsService.include,
          favoritePosts: { where: { userId: user.id } },
        },
      },
      filters.pagination,
    );
  }

  public findAll({
    where,
    include = PostsService.include,
    orderBy = PostsService.orderBy,
  }: Prisma.PostFindManyArgs): Promise<Post[]> {
    return this.prismaService.post.findMany({
      where,
      include,
      orderBy,
    });
  }

  public findOne(
    where: Prisma.PostWhereUniqueInput,
    include?: Prisma.PostInclude,
  ): Promise<Post> {
    return this.prismaService.post.findUniqueOrThrow({
      where,
      include: include ?? PostsService.include,
    });
  }

  public update(
    where: Prisma.PostWhereUniqueInput,
    data: Prisma.PostUpdateInput,
  ): Promise<Post> {
    return this.prismaService.post.update({ where, data });
  }

  public remove(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prismaService.post.delete({ where });
  }
}
