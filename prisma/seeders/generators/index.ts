import { faker } from '@faker-js/faker';
import { Prisma, $Enums } from '@prisma/client';
import { hashSync, genSaltSync } from 'bcrypt';

export const createUsersInput = (len: number): Prisma.UserCreateManyInput[] => {
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

export const createLocationsInput = (
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
      lat: faker.location.latitude({ min: 42, max: 46 }),
      lng: faker.location.longitude({ min: 19, max: 23 }),
    };
  });
};
