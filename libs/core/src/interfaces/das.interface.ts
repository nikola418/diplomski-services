import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

export interface DataAccessService {
  ['create']: (...args: any[]) => any;
}
