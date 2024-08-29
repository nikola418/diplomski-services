import { PrismaClient } from '@prisma/client';
import { isEmpty } from 'lodash';

export const extendPrismaClient = (prismaClient: PrismaClient) =>
  prismaClient.$extends({
    result: {
      post: {
        isFavoredByUser: {
          // @ts-expect-error workaround until prisma implements relational input on virtual fields
          needs: { favoritePosts: true },
          compute({ favoritePosts }) {
            return !isEmpty(favoritePosts);
          },
        },
      },
    },
  });

export type ExtendedPrismaClient = ReturnType<typeof extendPrismaClient>;
