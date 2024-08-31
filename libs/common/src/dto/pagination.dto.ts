import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsInt()
  page: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  perPage?: number;
}
