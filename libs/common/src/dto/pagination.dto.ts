import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  page: number = 1;

  @IsOptional()
  @IsPositive()
  @IsInt()
  perPage: number = 12;
}
