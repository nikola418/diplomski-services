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

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create' })
  public async create(@Payload() dto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(dto);
  }

  @MessagePattern({ cmd: 'paginate' })
  public paginate(
    @Payload('user') user: UserEntity,
    @Payload('queries') queries?: QueryUsersDto,
  ): Promise<PaginatedResult<UserEntity>> {
    return this.usersService.paginate(user, queries);
  }

  @MessagePattern({ cmd: 'findOne' })
  public findOne(@Payload('userId') userId: string): Promise<UserEntity> {
    return this.usersService.findOne({ id: userId });
  }

  @MessagePattern({ cmd: 'update' })
  public async update(
    @Payload('userId') userId: string,
    @Payload('dto') dto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update({ id: userId }, dto);
  }

  @MessagePattern({ cmd: 'remove' })
  public remove(@Payload('userId') userId: string): Promise<UserEntity> {
    return this.usersService.remove({ id: userId });
  }
}
