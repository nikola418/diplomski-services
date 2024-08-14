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
