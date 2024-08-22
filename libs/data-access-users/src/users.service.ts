import { Injectable } from '@nestjs/common';
import { $Enums, Prisma, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  public create(data: Omit<Prisma.UserCreateInput, 'roles'>): Promise<User> {
    return this.prismaService.user.create({
      data: {
        ...data,
        roles: { set: [$Enums.Role.User] },
        password: hashSync(data.password, genSaltSync()),
      },
    });
  }

  public findAll(where?: Prisma.UserWhereInput): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: { ...where, NOT: { roles: { has: $Enums.Role.Admin } } },
    });
  }

  public findOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({
      where: { ...where, NOT: { roles: { has: $Enums.Role.Admin } } },
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
