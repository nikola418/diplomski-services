import { UserEntity } from '@libs/data-access-users';
import { $Enums, Post } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { PostEntity } from './entity';

type Subjects = InferSubjects<Post>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ can }) {
    can(Actions.read, PostEntity);
  },
  Admin({ can }) {
    can(Actions.manage, PostEntity);
  },
};
