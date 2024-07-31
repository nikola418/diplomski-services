import { $Enums, User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
  roles: $Enums.Role[];
  createdAt: Date;
  updatedAt: Date;
}
