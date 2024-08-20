import { IsString } from 'class-validator';

export class CreateChatGroupMessageDto {
  @IsString()
  text: string;

  @IsString()
  chatGroupId: string;
}
