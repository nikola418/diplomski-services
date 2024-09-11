import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLocationDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsLatitude()
  @IsNumber()
  locationLat: number;

  @Type(() => Number)
  @IsLongitude()
  @IsNumber()
  locationLong: number;

  @IsOptional()
  @IsArray()
  @IsEnum($Enums.ActivityTag, { each: true })
  activityTags?: $Enums.ActivityTag[];

  @IsOptional()
  @IsArray()
  @IsEnum($Enums.NearbyTag, { each: true })
  nearbyTags?: $Enums.NearbyTag[];

  // !FOR SWAGGER ONLY
  @ApiProperty({
    required: false,
    name: 'images',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  imageKeys?: string[];
}
