import { PaginationDto } from '@libs/common/dto/pagination.dto';
import { Type } from 'class-transformer';
import { IsOptional, IsObject, ValidateNested } from 'class-validator';

export class QueryChatMessagesDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination?: PaginationDto;
}
