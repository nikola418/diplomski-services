import { Type } from 'class-transformer';
import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
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
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ConnectChatGroupDto)
  connectChatGroups: ConnectChatGroupDto[];

  @IsString()
  locationId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsISO8601()
  scheduledDateTime?: string;
}
