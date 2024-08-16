import { UserEntity, UsersService } from '@libs/data-access-users';
import { Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook, Request } from 'nest-casl';

@Injectable()
export class UserHook implements SubjectBeforeFilterHook<UserEntity, Request> {
  constructor(private readonly usersService: UsersService) {}

  async run({ params }: Request) {
    const user = await this.usersService.findOne({ id: params.userId });
    return new UserEntity(user);
  }
}
