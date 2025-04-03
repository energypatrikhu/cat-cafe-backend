import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function seed_products() {
  console.log(' Seeding products...');

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
  console.log(' Seeding blog posts...');

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
  console.log(' Seeding users...');

  if (
    !(await prisma.user.findFirst({ where: { email: 'worker@cat-cafe.hu' } }))
  ) {
    console.log('  Seeding worker user...');

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
    console.log('  Seeding user...');

    await prisma.user.create({
      data: {
        name: 'User Pista',
        email: 'user@cat-cafe.hu',
        password: await hash('user-pass-123'),
        role: 'USER',
      },
    });
  }

  console.log('  Seeding random users...');
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await hash(faker.internet.password()),
        role: 'USER',
      },
    });
  }
}

async function seed_reservations() {
  console.log(' Seeding reservations...');

  const users = await prisma.user.findMany({
    where: { role: 'USER' },
  });

  for (let i = 0; i < 10; i++) {
    await prisma.reservation.create({
      data: {
        date: faker.date.future(),
        User: {
          connect: {
            id: faker.helpers.arrayElement(users).id,
          },
        },
      },
    });
  }
}

async function seed() {
  console.log('< < < Seeding database > > >');

  await seed_users();
  await seed_products();
  await seed_blog_posts();
  await seed_reservations();

  console.log('< < < Seeding complete > > >');
}

(async () => {
  try {
    await prisma.$connect();
    await seed();
  } catch (error) {
    console.log('< < < Seeding failed > > >');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
