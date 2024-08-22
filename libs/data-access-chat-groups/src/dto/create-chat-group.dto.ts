import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateChatGroupMemberDto {
  @IsString()
  userId: string;
}

export class CreateChatGroupDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChatGroupMemberDto)
  chatGroupMembers?: CreateChatGroupMemberDto[];

  @IsString()
  postId: string;

  @IsOptional()
  @IsString()
  name?: string;
}
