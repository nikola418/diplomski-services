import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ValidateIf } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ValidateIf((_, v) => v)
  phoneNumber?: string;
}
