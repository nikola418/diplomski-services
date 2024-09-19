import { UserEntity } from '@libs/data-access-users';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { SubjectBeforeFilterHook } from 'nest-casl';

@Injectable()
export class UserHook implements SubjectBeforeFilterHook<User, Request> {
  public async run({ params }: Request): Promise<User> {
    return new UserEntity({ id: params.userId });
  }
}
