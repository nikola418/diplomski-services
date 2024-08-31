import { PaginatedResult, paginator } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { QueryUsersDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly paginator = paginator({ perPage: 12 });

  public create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  public async paginate(
    filters: QueryUsersDto,
    user: User,
  ): Promise<PaginatedResult<User>> {
    return this.paginator<User, Prisma.UserFindManyArgs>(
      this.prismaService.user,
      {
        where: {
          username: {
            contains: filters.username,
            not: user.username,
            mode: 'insensitive',
          },
        },
      },
      filters.pagination,
    );
  }

  public findAll(where?: Prisma.UserWhereInput): Promise<User[]> {
    return this.prismaService.user.findMany({
      where,
    });
  }

  public findOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({
      where,
    });
  }

  public update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prismaService.user.update({ where, data });
  }

  public remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({ where });
  }
}
