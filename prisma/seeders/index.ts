import { $Enums, PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { faker } from '@faker-js/faker';

const prismaClient = new PrismaClient();
async function seed() {
  await prismaClient.user.upsert({
    where: {
      email: 'superuser@diplomski.com',
      username: 'admin',
    },
    create: {
      email: 'superuser@diplomski.com',
      password: hashSync('Password123.', genSaltSync()),
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Admin',
      roles: { set: [$Enums.Role.Admin] },
    },
    update: {
      password: hashSync('Password123.', genSaltSync()),
      firstName: 'Admin',
      lastName: 'Admin',
      roles: { set: [$Enums.Role.Admin] },
    },
  });

  await prismaClient.user.createMany({
    skipDuplicates: true,
    data: [
      {
        email: faker.internet.email(),
        password: hashSync('Password123.', genSaltSync()),
        username: faker.internet.userName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        roles: { set: [$Enums.Role.User] },
      },
      {
        email: faker.internet.email(),
        password: hashSync('Password123.', genSaltSync()),
        username: faker.internet.userName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        roles: { set: [$Enums.Role.User] },
      },
      {
        email: faker.internet.email(),
        password: hashSync('Password123.', genSaltSync()),
        username: faker.internet.userName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        roles: { set: [$Enums.Role.User] },
      },
      {
        email: faker.internet.email(),
        password: hashSync('Password123.', genSaltSync()),
        username: faker.internet.userName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        roles: { set: [$Enums.Role.User] },
      },
      {
        email: faker.internet.email(),
        password: hashSync('Password123.', genSaltSync()),
        username: faker.internet.userName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        roles: { set: [$Enums.Role.User] },
      },
    ],
  });

  await prismaClient.post.createMany({
    skipDuplicates: true,
    data: [
      {
        title: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        activityTags: {
          set: [
            $Enums.ActivityTag.Biking,
            $Enums.ActivityTag.Camping,
            $Enums.ActivityTag.Fishing,
            $Enums.ActivityTag.Hiking,
          ],
        },
        nearbyTags: {
          set: [
            $Enums.NearbyTag.Bakery,
            $Enums.NearbyTag.Groceries,
            $Enums.NearbyTag.Hospital,
            $Enums.NearbyTag.Pharmacy,
          ],
        },
        averageRating: faker.number.float({ max: 5, min: 0 }),
        ratingsCount: faker.number.int({ min: 1, max: 50 }),
        locationLong: faker.location.longitude({ min: 19, max: 23 }),
        locationLat: faker.location.latitude({ min: 42, max: 46 }),
      },
      {
        title: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        activityTags: {
          set: [
            $Enums.ActivityTag.Biking,
            $Enums.ActivityTag.Camping,
            $Enums.ActivityTag.Fishing,
          ],
        },
        nearbyTags: {
          set: [
            $Enums.NearbyTag.Bakery,
            $Enums.NearbyTag.Groceries,
            $Enums.NearbyTag.Pharmacy,
          ],
        },
        averageRating: faker.number.float({ max: 5, min: 0 }),
        ratingsCount: faker.number.int({ min: 1, max: 50 }),
        locationLat: faker.location.latitude({ min: 19, max: 23 }),
        locationLong: faker.location.longitude({ min: 42, max: 46 }),
      },
      {
        title: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        activityTags: {
          set: [
            $Enums.ActivityTag.Biking,
            $Enums.ActivityTag.Fishing,
            $Enums.ActivityTag.Hiking,
          ],
        },
        nearbyTags: {
          set: [
            $Enums.NearbyTag.Groceries,
            $Enums.NearbyTag.Hospital,
            $Enums.NearbyTag.Pharmacy,
          ],
        },
        averageRating: faker.number.float({ max: 5, min: 0 }),
        ratingsCount: faker.number.int({ min: 1, max: 50 }),
        locationLat: faker.location.latitude({ min: 19, max: 23 }),
        locationLong: faker.location.longitude({ min: 42, max: 46 }),
      },
      {
        title: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        activityTags: {
          set: [
            $Enums.ActivityTag.Biking,
            $Enums.ActivityTag.Camping,
            $Enums.ActivityTag.Hiking,
          ],
        },
        nearbyTags: {
          set: [$Enums.NearbyTag.Bakery, $Enums.NearbyTag.Groceries],
        },
        averageRating: faker.number.float({ max: 5, min: 0 }),
        ratingsCount: faker.number.int({ min: 1, max: 50 }),
        locationLat: faker.location.latitude({ min: 19, max: 23 }),
        locationLong: faker.location.longitude({ min: 42, max: 46 }),
      },
      {
        title: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        activityTags: {
          set: [
            $Enums.ActivityTag.Biking,
            $Enums.ActivityTag.Camping,
            $Enums.ActivityTag.Hiking,
          ],
        },
        nearbyTags: {
          set: [
            $Enums.NearbyTag.Bakery,
            $Enums.NearbyTag.Hospital,
            $Enums.NearbyTag.Pharmacy,
          ],
        },
        averageRating: faker.number.float({ max: 5, min: 0 }),
        ratingsCount: faker.number.int({ min: 1, max: 50 }),
        locationLat: faker.location.latitude({ min: 19, max: 23 }),
        locationLong: faker.location.longitude({ min: 42, max: 46 }),
      },
    ],
  });
}

seed()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
