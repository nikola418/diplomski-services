import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  private static readonly include: Prisma.PostInclude = {};
  private static readonly orderBy: Prisma.PostOrderByWithRelationInput = {
    createdAt: 'desc',
  };

  public create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prismaService.post.create({ data });
  }

  public findAll(where?: Prisma.PostWhereInput): Promise<Post[]> {
    return this.prismaService.post.findMany({
      where,
      orderBy: PostsService.orderBy,
    });
  }

  public findOne(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prismaService.post.findUniqueOrThrow({ where });
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
