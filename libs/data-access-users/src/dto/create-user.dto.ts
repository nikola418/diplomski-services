import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsAlphanumeric()
  username: string;

  @IsOptional()
  @IsPhoneNumber('RS', { message: 'Must be a valid rs-RS phone number' })
  phoneNumber?: string;

  /**
   * @example  email@example.com
   */
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  // !FOR SWAGGER ONLY
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    required: false,
    name: 'profileImage',
    type: 'string',
    format: 'binary',
  })
  profileImageKey?: string;
}
