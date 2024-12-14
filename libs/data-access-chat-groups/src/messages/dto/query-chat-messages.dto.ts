import { PaginateOptionsDto } from '@libs/common';
import { Type } from 'class-transformer';
import { IsOptional, IsObject, ValidateNested } from 'class-validator';

export class QueryChatMessagesDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginateOptionsDto)
  pagination?: PaginateOptionsDto;
}
