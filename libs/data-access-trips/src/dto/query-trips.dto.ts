import { PaginationDto } from '@libs/common/dto/pagination.dto';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class QueryTripsDto {
  @IsOptional()
  @IsString()
  chatGroupId?: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination?: PaginationDto;
}
