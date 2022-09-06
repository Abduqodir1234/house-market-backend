import { PrismaClient } from '@prisma/client';
import { houseSeeders } from './data/house.seeders';
import { userSeeders } from './data/user.seeders';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.users.createMany({
      data: await userSeeders(),
    });

    await prisma.houses.createMany({ data: houseSeeders() });

    prisma.$disconnect();

    process.exit(0);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);

    prisma.$disconnect();

    process.exit(1);
  }
}

main();
