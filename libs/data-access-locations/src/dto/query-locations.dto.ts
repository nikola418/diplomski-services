import { PaginateOptionsDto } from '@libs/common';
import { $Enums } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsLongitude,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class BoundsDto {
  @IsLongitude()
  gte: number;

  @IsLongitude()
  lte: number;
}

class RangeDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BoundsDto)
  upper?: BoundsDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BoundsDto)
  lower?: BoundsDto;
}

class CoordinatesDto {
  @IsObject()
  @ValidateNested()
  @Type(() => RangeDto)
  lat: RangeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => RangeDto)
  lng: RangeDto;
}

export class QueryLocationsDto {
  @IsOptional()
  @IsArray()
  @IsEnum($Enums.ActivityTag, { each: true })
  activityTags?: $Enums.ActivityTag[];

  @IsOptional()
  @IsArray()
  @IsEnum($Enums.NearbyTag, { each: true })
  nearbyTags?: $Enums.NearbyTag[];

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  range?: CoordinatesDto;

  @Transform(({ obj }) => obj.isFavoredByUser === 'true')
  @IsOptional()
  @IsBoolean()
  isFavoredByUser?: boolean;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginateOptionsDto)
  pagination?: PaginateOptionsDto;
}
