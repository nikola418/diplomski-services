import { TripEntity } from '@libs/data-access-trips';
import { UserEntity } from '@libs/data-access-users';
import { $Enums } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';

type Subjects = InferSubjects<TripEntity>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ can, user }) {
    can(Actions.manage, TripEntity, {
      creatorUserId: user.id,
    });
    can(Actions.read, TripEntity, {
      chatGroup: {
        $in: [
          { ownerUserId: user.id },
          { chatGroupMembers: { $in: [{ userId: user.id }] } },
        ],
      },
    });
  },
};
