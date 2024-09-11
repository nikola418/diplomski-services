import { ChatGroupEntity } from '@libs/data-access-chat-groups';
import { UserEntity } from '@libs/data-access-users';
import { $Enums, ChatGroup } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';

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
