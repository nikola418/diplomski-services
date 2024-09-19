import { FavoriteLocationEntity, UserEntity } from '@libs/data-access-users';
import { $Enums, FavoriteLocation, User } from '@prisma/client';
import { Actions, Permissions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';

type Subjects = InferSubjects<{
  FavoriteLocation: FavoriteLocation;
  User: User;
}>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ can, user }) {
    can(Actions.manage, FavoriteLocationEntity, { userId: user.id });
    can(Actions.create, FavoriteLocationEntity, { id: user.id });
    can(Actions.manage, UserEntity, { id: user.id });
  },
};
