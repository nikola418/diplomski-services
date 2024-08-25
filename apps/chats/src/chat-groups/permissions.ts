import { UserEntity } from '@libs/data-access-users';
import { $Enums, ChatGroup } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { ChatGroupEntity } from './entity';

type Subjects = InferSubjects<ChatGroup>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ can, user }) {
    can(Actions.read, ChatGroupEntity, {
      chatGroupMembers: { $elemMatch: { userId: user.id } },
    });
    can(Actions.manage, ChatGroupEntity, { ownerUserId: user.id });
  },
};
