import {
  IsAlphanumeric,
  IsEmail,
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

  @IsPhoneNumber('RS', { message: 'Must be a valid rs-RS phone number' })
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
