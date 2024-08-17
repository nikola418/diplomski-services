import { $Enums, PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';

const prismaClient = new PrismaClient();
async function seed() {
  await prismaClient.user.create({
    data: {
      email: 'admin@diplomski.com',
      password: hashSync('Password123.', genSaltSync()),
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Admin',
      roles: { set: [$Enums.Role.Admin] },
    },
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
