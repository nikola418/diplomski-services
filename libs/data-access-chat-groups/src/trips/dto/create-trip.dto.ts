import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTripDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  scheduledDateTime?: string;
}
