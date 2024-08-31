import { CreateUserDto } from '@libs/data-access-users';
import { PickType } from '@nestjs/swagger';

export class SignInDto extends PickType(CreateUserDto, [
  'username',
  'password',
]) {}
