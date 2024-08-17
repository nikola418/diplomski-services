import { FavoritePostEntity } from '@libs/data-access-posts';
import { UserEntity } from '@libs/data-access-users';
import { $Enums, FavoritePost } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';

type Subjects = InferSubjects<FavoritePost>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ can, user }) {
    can(Actions.manage, FavoritePostEntity, { userId: user.id });
    can(Actions.create, FavoritePostEntity, { id: user.id });
  },
};
