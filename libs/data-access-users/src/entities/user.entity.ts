import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  avatarImageKey: string;
  email: string;
  password: string;
  @ApiProperty({ enum: $Enums.Role })
  roles: $Enums.Role[];
  createdAt: Date;
  updatedAt: Date;
}
