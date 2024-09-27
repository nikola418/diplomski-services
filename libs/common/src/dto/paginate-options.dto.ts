import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginateOptionsDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  perPage?: number;
}
