import { AttendanceEntity, TripEntity } from '@libs/data-access-trips';
import { UserEntity } from '@libs/data-access-users';
import { $Enums } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';

type Subjects = InferSubjects<typeof TripEntity | typeof AttendanceEntity>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ can, user }) {
    can(Actions.update, TripEntity, {
      creatorUserId: { $ne: user.id },
      chatGroup: {
        $in: [
          { ownerUserId: user.id },
          { chatGroupMembers: { $in: [{ userId: user.id }] } },
        ],
      },
    });
    can(Actions.manage, AttendanceEntity, {
      userId: user.id,
    });
  },
};
