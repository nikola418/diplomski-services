import { ApiProperty, PartialType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateTripDto } from './create-trip.dto';

export class UpdateTripDto extends PartialType(CreateTripDto) {
  @ApiProperty({ enum: $Enums.TripStatus })
  @IsOptional()
  @IsEnum($Enums.TripStatus)
  tripStatus?: $Enums.TripStatus;
}
