import {
  PaginatedResult,
  PaginateFunction,
  PaginateOptions,
  paginator,
} from '@libs/common';
import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  private static readonly orderBy: Prisma.PostOrderByWithRelationInput = {
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
    {
      where,
      include = PostsService.include,
      orderBy = PostsService.orderBy,
    }: Prisma.PostFindManyArgs,
    pagination?: PaginateOptions,
  ): Promise<PaginatedResult<Post>> {
    return this.paginator<Post, Prisma.PostFindManyArgs>(
      this.prismaService.post,
      { include, where, orderBy },
      pagination,
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
