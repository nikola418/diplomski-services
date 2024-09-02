import { CreateChatGroupDto } from '@libs/data-access-chat-groups';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ConnectChatGroupDto {
  @IsString()
  chatGroupId: string;
}

export class CreateTripDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConnectChatGroupDto)
  connectChatGroups: ConnectChatGroupDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChatGroupDto)
  createChatGroups: CreateChatGroupDto[];

  @IsString()
  locationId: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  scheduledDateTime?: string;
}
