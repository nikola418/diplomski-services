import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateChatGroupMemberDto {
  @IsString()
  userId: string;
}

export class CreateChatGroupDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChatGroupMemberDto)
  createChatGroupMembers?: CreateChatGroupMemberDto[];

  @IsString()
  name: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    required: false,
    name: 'avatarImage',
    type: 'string',
    format: 'binary',
  })
  avatarImageKey?: string;
}
