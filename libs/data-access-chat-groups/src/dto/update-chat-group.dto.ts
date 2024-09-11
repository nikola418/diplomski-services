import { PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateChatGroupDto } from './create-chat-group.dto';

export class UpdateChatGroupDto extends PartialType(CreateChatGroupDto) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deleteChatGroupMemberIds: string[] = [];
}
