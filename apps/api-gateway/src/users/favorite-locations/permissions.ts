import { FavoriteLocationEntity, UserEntity } from '@libs/data-access-users';
import { $Enums, FavoriteLocation } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';

type Subjects = InferSubjects<FavoriteLocation>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ can, user }) {
    can(Actions.manage, FavoriteLocationEntity, { userId: user.id });
    can(Actions.create, FavoriteLocationEntity, { id: user.id });
  },
};
