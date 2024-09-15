import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Može sadržati samo karaktere' })
  firstName: string;

  @IsString({ message: 'Može sadržati samo karaktere' })
  lastName: string;

  @MaxLength(24, { message: 'Najviše 24 karaktera' })
  @MinLength(8, { message: 'Najmanje 8 karaktera' })
  @IsAlphanumeric('en-GB', {
    message: 'Može sadržati samo alfanumeričke karaktere abecede',
  })
  username: string;

  @IsOptional()
  @IsPhoneNumber('RS', {
    message: 'Mora biti validan telefonski broj u formatu +381-XX-XXX-XXX',
  })
  phoneNumber?: string;

  /**
   * @example  email@example.com
   */
  @IsEmail({}, { message: 'Mora biti validan email' })
  email: string;

  @IsStrongPassword(
    { minLength: 8, minNumbers: 1, minUppercase: 1, minSymbols: 1 },
    {
      message:
        'Mora biti jaka lozinka od 8 karaktera, 1 velikim slovom, 1 brojem i 1 simbolom',
    },
  )
  password: string;

  // !FOR SWAGGER ONLY
  @ApiProperty({
    required: false,
    name: 'avatarImage',
    type: 'string',
    format: 'binary',
  })
  avatarImageKey?: string;
}
