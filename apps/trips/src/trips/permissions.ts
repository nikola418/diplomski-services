import { UserEntity } from '@libs/data-access-users';
import { $Enums, Trip } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { TripEntity } from './entities';

type Subjects = InferSubjects<Trip>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ can, user }) {
    can(Actions.manage, TripEntity, {
      chatGroup: {
        ownerUserId: user.id,
      },
    });
    can(Actions.read, TripEntity);
  },
};
