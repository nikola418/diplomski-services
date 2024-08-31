import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class ConnectChatGroupDto {
  @IsString()
  chatGroupId: string;
}

export class CreateTripDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsArray()
  @ValidateNested()
  @Type(() => ConnectChatGroupDto)
  chatGroups: ConnectChatGroupDto[];
}
