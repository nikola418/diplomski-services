import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
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

  // @ApiProperty({ enum: $Enums.ActivityTag, isArray: true, required: false, for})
  // @IsOptional()
  // @IsEnum($Enums.ActivityTag, { each: true })
  // activityTags: $Enums.ActivityTag[];

  // @ApiProperty({ enum: $Enums.NearbyTag, isArray: true, required: false })
  // @IsOptional()
  // @IsEnum($Enums.NearbyTag, { each: true })
  // nearbyTags: $Enums.NearbyTag[];

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
