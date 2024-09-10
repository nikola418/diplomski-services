import { PaginatedResult } from '@libs/common';
import {
  CreateUserDto,
  QueryUsersDto,
  UpdateUserDto,
  UserEntity,
  UsersService,
} from '@libs/data-access-users';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { $Enums, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create' })
  public async create(@Payload() data: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create({
      ...data,
      password: hashSync(data.password, genSaltSync()),
      roles: { set: [$Enums.Role.User] },
    });
  }

  @MessagePattern({ cmd: 'paginate' })
  public paginate(
    @Payload('user') user: User,
    @Payload('queries') queries?: QueryUsersDto,
  ): Promise<PaginatedResult<User>> {
    return this.usersService.paginate(user, queries);
  }

  @MessagePattern({ cmd: 'findOne' })
  public findOne(@Payload('userId') id: string): Promise<UserEntity> {
    return this.usersService.findOne({ id });
  }

  @MessagePattern({ cmd: 'update' })
  public async update(
    @Payload('userId') id: string,
    @Payload('data') data: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update({ id }, data);
  }

  @MessagePattern({ cmd: 'remove' })
  public remove(@Payload('userId') id: string): Promise<UserEntity> {
    return this.usersService.remove({ id });
  }
}
