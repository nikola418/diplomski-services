import { LocationEntity } from '@libs/data-access-locations';
import { UserEntity } from '@libs/data-access-users';
import { $Enums } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';

type Subjects = InferSubjects<Location>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ can }) {
    can(Actions.read, LocationEntity);
  },
  Admin({ can }) {
    can(Actions.manage, LocationEntity);
  },
};
