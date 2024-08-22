import { UserEntity } from '@libs/data-access-users';
import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { ChatGroupMessageEntity } from './entity';
import { $Enums } from '@prisma/client';

type Subjects = InferSubjects<ChatGroupMessageEntity>;

export const permissions: Permissions<
  $Enums.Role,
  Subjects,
  Actions,
  UserEntity
> = {
  everyone({ can }) {
    can(Actions.read, ChatGroupMessageEntity);
  },
  Admin({ can }) {
    can(Actions.manage, ChatGroupMessageEntity);
  },
};
