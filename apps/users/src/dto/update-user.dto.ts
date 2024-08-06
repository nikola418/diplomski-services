import { PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsMongoId()
  profileImageUrl?: string;
}
