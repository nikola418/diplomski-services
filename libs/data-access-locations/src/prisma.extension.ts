import { PrismaClient } from '@prisma/client';
import { isEmpty } from 'lodash';

export const extendPrismaClient = (prismaClient: PrismaClient) =>
  prismaClient.$extends({
    result: {
      location: {
        isFavoredByUser: {
          // @ts-expect-error workaround until prisma implements relational input on virtual fields
          needs: { favoriteLocations: true },
          compute({ favoriteLocations }) {
            return !isEmpty(favoriteLocations);
          },
        },
      },
    },
  });

export type ExtendedPrismaClient = ReturnType<typeof extendPrismaClient>;
