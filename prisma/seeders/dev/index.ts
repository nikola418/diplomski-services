import { $Enums, PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { createUsersInput, createLocationsInput } from '../generators';

export async function seedDev() {
  const prismaClient = new PrismaClient();

  try {
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
  } catch (error) {
    console.log(error);
  } finally {
    await prismaClient.$disconnect();
    process.exit();
  }
}
