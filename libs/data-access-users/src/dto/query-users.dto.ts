import { PaginationDto } from '@libs/common/dto/pagination.dto';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class QueryUsersDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination?: PaginationDto;
}
