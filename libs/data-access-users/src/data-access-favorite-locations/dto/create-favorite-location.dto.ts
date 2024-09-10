import { IsString } from 'class-validator';

export class CreateFavoriteLocationDto {
  @IsString()
  locationId: string;
}
