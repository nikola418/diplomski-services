import { PrismaClient } from '@prisma/client';
import { isEmpty } from 'lodash';

export const prismaExtension = new PrismaClient().$extends({
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

export type ExtendedPrismaClient = typeof prismaExtension;
