import { PaginateOptionsDto } from '@libs/common';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class QueryChatGroupsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginateOptionsDto)
  pagination?: PaginateOptionsDto;
}
