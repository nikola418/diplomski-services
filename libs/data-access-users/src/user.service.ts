import { PaginatedResult } from '@libs/core';
import { paginatorFactory } from '@libs/core/factories';
import { Injectable } from '@nestjs/common';
import { $Enums, Prisma, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto, QueryUsersDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly paginator = paginatorFactory({ perPage: 12 });

  public create(dto: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: {
        ...dto,
        password: hashSync(dto.password, genSaltSync()),
        roles: { set: [$Enums.Role.User] },
      },
    });
  }

  public async paginate(
    user: User,
    queries?: QueryUsersDto,
  ): Promise<PaginatedResult<User>> {
    return this.paginator<User, Prisma.UserFindManyArgs>(
      this.prismaService.user,
      {
        where: {
          AND: [
            {
              id: { not: user.id },
              NOT: { roles: { has: 'Admin' } },
            },
            {
              OR: [
                {
                  username: {
                    contains: queries.username,
                    mode: 'insensitive',
                  },
                },
                {
                  firstName: {
                    contains: queries.firstName,
                    mode: 'insensitive',
                  },
                },
                {
                  lastName: {
                    contains: queries.lastName,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          ],
        },
      },
      queries.pagination,
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
    dto: UpdateUserDto,
  ): Promise<User> {
    return this.prismaService.user.update({
      where,
      data: {
        ...dto,
        password: dto.password && hashSync(dto.password, genSaltSync()),
      },
    });
  }

  public remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({ where });
  }
}
