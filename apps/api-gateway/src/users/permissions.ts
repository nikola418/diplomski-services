import { UserEntity } from '@libs/data-access-users';
import { $Enums, User } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';

type Subjects = InferSubjects<User>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ can, user }) {
    can(Actions.manage, UserEntity, { id: user.id });
    can(Actions.read, UserEntity);
  },
};
