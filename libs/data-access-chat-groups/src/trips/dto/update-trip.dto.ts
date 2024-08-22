import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTripDto } from './create-trip.dto';
import { $Enums } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateTripDto extends PartialType(CreateTripDto) {
  @ApiProperty({ enum: $Enums.TripStatus })
  @IsOptional()
  @IsEnum($Enums.TripStatus)
  tripStatus?: $Enums.TripStatus;
}
