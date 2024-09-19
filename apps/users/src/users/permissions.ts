import { InferSubjects } from '@casl/ability';
import { UserEntity } from '@libs/data-access-users';
import { $Enums, User } from '@prisma/client';
import { Actions, Permissions } from 'nest-casl';

type Subjects = InferSubjects<{
  User: User;
}>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ user, can }) {
    can(Actions.manage, UserEntity, { id: user.id });
    can(Actions.read, UserEntity);
  },
};
