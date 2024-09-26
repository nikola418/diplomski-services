import { faker } from '@faker-js/faker';
import { $Enums, Prisma } from '@prisma/client';

export const locations = [
  {
    title: 'Uvac',
    description: faker.lorem.text(),
    ratingsCount: faker.number.int({ min: 1, max: 100 }),
    averageRating: faker.number.float({ min: 1, max: 5 }),
    activityTags: faker.helpers.arrayElements([
      'Biking',
      'Camping',
      'Fishing',
      'Hiking',
    ]),
    nearbyTags: [$Enums.NearbyTag.Pharmacy],
    nearbys: {
      createMany: {
        skipDuplicates: true,
        data: [
          {
            nearbyTag: $Enums.NearbyTag.Pharmacy,
            lat: 43.343,
            lng: 19.969,
          },
        ],
      },
    },
    lat: 43.342998628,
    lng: 19.968829458,
  },
  {
    title: 'Fruška Gora',
    description: faker.lorem.text(),
    ratingsCount: faker.number.int({ min: 1, max: 100 }),
    averageRating: faker.number.float({ min: 1, max: 5 }),
    activityTags: faker.helpers.arrayElements([
      'Biking',
      'Camping',
      'Fishing',
      'Hiking',
    ]),
    nearbyTags: [$Enums.NearbyTag.Pharmacy],
    nearbys: {
      createMany: {
        skipDuplicates: true,
        data: [
          {
            nearbyTag: $Enums.NearbyTag.Pharmacy,
            lat: 45.153,
            lng: 19.713,
          },
        ],
      },
    },
    lat: 45.1511,
    lng: 19.7111,
  },
  {
    title: 'Tara',
    description: faker.lorem.text(),
    ratingsCount: faker.number.int({ min: 1, max: 100 }),
    averageRating: faker.number.float({ min: 1, max: 5 }),
    activityTags: faker.helpers.arrayElements([
      'Biking',
      'Camping',
      'Fishing',
      'Hiking',
    ]),
    nearbyTags: [$Enums.NearbyTag.Pharmacy],
    nearbys: {
      createMany: {
        skipDuplicates: true,
        data: [
          {
            nearbyTag: $Enums.NearbyTag.Pharmacy,
            lat: 43.847,
            lng: 19.459,
          },
        ],
      },
    },
    lat: 43.848333,
    lng: 19.459444,
  },
  {
    title: 'Stopića Pećina',
    description: faker.lorem.text(),
    ratingsCount: faker.number.int({ min: 1, max: 100 }),
    averageRating: faker.number.float({ min: 1, max: 5 }),
    activityTags: faker.helpers.arrayElements([
      'Biking',
      'Camping',
      'Fishing',
      'Hiking',
    ]),
    nearbyTags: [$Enums.NearbyTag.Pharmacy],
    nearbys: {
      createMany: {
        skipDuplicates: true,
        data: [
          {
            nearbyTag: $Enums.NearbyTag.Pharmacy,
            lat: 43.701,
            lng: 19.856,
          },
        ],
      },
    },
    lat: 43.702222,
    lng: 19.855,
  },
] satisfies Prisma.LocationCreateInput[];
