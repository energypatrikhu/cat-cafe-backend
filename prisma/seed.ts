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
        image: faker.string.uuid() + '.webp',
        quantity: faker.number.int({ min: 0, max: 100 }),
      },
    });
  }
}

async function seed_blog_posts() {
  for (let i = 0; i < 10; i++) {
    await prisma.blog.create({
      data: {
        title: faker.lorem.words(5),
        content: faker.lorem.paragraphs(3),
      },
    });
  }
}

async function seed_users() {
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

  if (
    !(await prisma.user.findFirst({ where: { email: 'user@cat-cafe.hu' } }))
  ) {
    await prisma.user.create({
      data: {
        name: 'User Pista',
        email: 'user@cat-cafe.hu',
        password: await hash('user-pass-123'),
        role: 'USER',
      },
    });
  }
}

(async () => {
  try {
    await prisma.$connect();

    await seed_users();
    await seed_products();
    await seed_blog_posts();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
