import { PaginateOptionsDto } from '@libs/common';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
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
  @IsEnum($Enums.TripStatus)
  tripStatus?: $Enums.TripStatus;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginateOptionsDto)
  pagination?: PaginateOptionsDto;
}
