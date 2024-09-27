import { PaginateOptionsDto } from '@libs/common';

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
};

export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptionsDto,
) => Promise<PaginatedResult<T>>;
