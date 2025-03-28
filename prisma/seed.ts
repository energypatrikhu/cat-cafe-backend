import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function seed_products() {
  for (let i = 0; i < 10; i++) {
    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        url: faker.image.url(),
        quantity: faker.number.int({ min: 0, max: 100 }),
      },
    });
  }
}

async function seed_worker_user() {
  if (
    !(await prisma.user.findFirst({ where: { email: 'worker@cat-cafe.hu' } }))
  ) {
    await prisma.user.create({
      data: {
        name: 'Worker Pista',
        email: 'worker@cat-cafe.hu',
        password: await hash('worker-pass-123'),
        role: 'WORKER',
      },
    });
  }
}

(async () => {
  try {
    await prisma.$connect();

    await seed_products();
    await seed_worker_user();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
