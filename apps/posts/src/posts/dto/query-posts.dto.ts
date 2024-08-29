import { PaginationDto } from '@libs/common/dto/pagination.dto';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class RangeDto {
  @Max(90)
  @Min(-90)
  @IsNumber()
  upper: number;

  @Max(90)
  @Min(-90)
  @IsNumber()
  lower: number;
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

export class QueryPostsDto {
  @IsOptional()
  @IsArray()
  @IsEnum($Enums.ActivityTag, { each: true })
  activityTags?: $Enums.ActivityTag[] = [];

  @IsOptional()
  @IsArray()
  @IsEnum($Enums.NearbyTag, { each: true })
  nearbyTags?: $Enums.NearbyTag[] = [];

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto = new PaginationDto();

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  range?: CoordinatesDto;
}
