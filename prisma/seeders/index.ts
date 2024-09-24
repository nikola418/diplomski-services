import { $Enums, Prisma, PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { faker } from '@faker-js/faker';

const prismaClient = new PrismaClient();

const createUsersInput = (len: number): Prisma.UserCreateManyInput[] => {
  const firstNames = faker.helpers.uniqueArray(faker.person.firstName, len);
  const lastNames = faker.helpers.uniqueArray(faker.person.firstName, len);

  return [...new Array(len)].map((_, index) => {
    return {
      firstName: firstNames[index],
      lastName: lastNames[index],
      username: faker.internet.userName({
        firstName: firstNames[index],
        lastName: lastNames[index],
      }),
      email: faker.internet.email({
        firstName: firstNames[index],
        lastName: lastNames[index],
      }),
      password: hashSync('Password123.', genSaltSync()),
      phoneNumber: faker.phone.number(),
      roles: { set: [$Enums.Role.User] },
    };
  });
};

const createLocationsInput = (
  len: number,
): Prisma.LocationCreateManyInput[] => {
  const titles = faker.helpers.uniqueArray(faker.lorem.words, len);

  return [...new Array(len)].map((_, index) => {
    return {
      title: titles[index],
      description: faker.lorem.text(),
      ratingsCount: faker.number.int({ min: 1, max: 100 }),
      averageRating: faker.number.float({ min: 1, max: 5 }),
      activityTags: faker.helpers.arrayElements([
        'Biking',
        'Camping',
        'Fishing',
        'Hiking',
      ]),
      nearbyTags: faker.helpers.arrayElements([
        'Bakery',
        'Groceries',
        'Pharmacy',
        'Hospital',
      ]),
      locationLat: faker.location.latitude({ min: 42, max: 46 }),
      locationLong: faker.location.longitude({ min: 19, max: 23 }),
    };
  });
};

async function seed() {
  await prismaClient.user.upsert({
    where: {
      email: 'superuser@diplomski.com',
      username: 'adminski',
    },
    create: {
      email: 'superuser@diplomski.com',
      username: 'adminski',
      password: hashSync('Password123.', genSaltSync()),
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
    data: createUsersInput(10),
  });

  await prismaClient.location.createMany({
    skipDuplicates: true,
    data: createLocationsInput(50),
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
