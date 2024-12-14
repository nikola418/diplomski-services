import { PaginatedResult } from '@libs/core';
import { plainToInstance } from 'class-transformer';

export class PaginatedResultEntity<T> implements PaginatedResult<T> {
  constructor(partial: Partial<PaginatedResultEntity<T>>) {
    Object.assign(this, partial);
  }

  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };

  serialize(entityClass: new (...args: T[]) => T): PaginatedResult<T> {
    this.data = plainToInstance(entityClass, this.data);
    return this;
  }
}
