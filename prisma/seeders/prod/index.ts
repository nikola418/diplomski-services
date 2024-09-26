import { PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { locations } from '../data';
import { createUsersInput } from '../generators';

export async function seedProd() {
  const prismaClient = new PrismaClient();
  try {
    await prismaClient.user.upsert({
      where: {
        email: process.env.SUPERUSER_EMAIL,
        username: process.env.SUPERUSER_USERNAME,
      },
      create: {
        firstName: 'Admin',
        lastName: 'Admin',
        roles: ['Admin'],
        email: process.env.SUPERUSER_EMAIL,
        username: process.env.SUPERUSER_USERNAME,
        password: hashSync(process.env.SUPERUSER_PASSWORD, genSaltSync()),
      },
      update: {
        firstName: 'Admin',
        lastName: 'Admin',
        roles: ['Admin'],
        password: hashSync(process.env.SUPERUSER_PASSWORD, genSaltSync()),
      },
    });

    for (const user of createUsersInput(10)) {
      await prismaClient.user.upsert({
        where: { username: user.username },
        create: user,
        update: {},
      });
    }

    for (const location of locations) {
      await prismaClient.location.upsert({
        where: { title: location.title },
        create: location,
        update: {},
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await prismaClient.$disconnect();
    process.exit();
  }
}
