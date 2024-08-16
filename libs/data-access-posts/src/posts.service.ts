import { Inject, Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from './prisma.extension';

@Injectable()
export class PostsService {
  constructor(
    @Inject('CustomPrisma')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  private static readonly orderBy: Prisma.PostOrderByWithRelationInput = {
    createdAt: 'desc',
  };
  public static readonly include: Prisma.PostInclude = { reviews: true };

  public create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prismaService.client.post.create({ data });
  }

  public findAll(
    where?: Prisma.PostWhereInput,
    include?: Prisma.PostInclude,
  ): Promise<Post[]> {
    return this.prismaService.client.post.findMany({
      where,
      orderBy: PostsService.orderBy,
      include: include ?? PostsService.include,
    });
  }

  public findOne(
    where: Prisma.PostWhereUniqueInput,
    include?: Prisma.PostInclude,
  ): Promise<Post> {
    return this.prismaService.client.post.findUniqueOrThrow({
      where,
      include: include ?? PostsService.include,
    });
  }

  public update(
    where: Prisma.PostWhereUniqueInput,
    data: Prisma.PostUpdateInput,
  ): Promise<Post> {
    return this.prismaService.client.post.update({ where, data });
  }

  public remove(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prismaService.client.post.delete({ where });
  }
}
