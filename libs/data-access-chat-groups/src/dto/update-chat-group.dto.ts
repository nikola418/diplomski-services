import { PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { CreateChatGroupDto } from './create-chat-group.dto';

export class UpdateChatGroupDto extends PartialType(CreateChatGroupDto) {
  @IsOptional()
  @IsArray()
  deleteChatGroupMemberIds: string[] = [];
}
