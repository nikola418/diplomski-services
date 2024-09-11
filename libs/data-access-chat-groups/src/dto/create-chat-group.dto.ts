import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => {
    const parsed: CreateChatGroupMemberDto[] = JSON.parse(value);
    return parsed.map((each) => {
      const typed = new CreateChatGroupMemberDto();
      typed.userId = each.userId;
      return typed;
    });
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  createChatGroupMembers: CreateChatGroupMemberDto[] = [];

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
