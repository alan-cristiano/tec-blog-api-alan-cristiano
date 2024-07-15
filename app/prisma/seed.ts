import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roundsOfHashing = 10;

const main = async () => {
  const passwordUser1 = await bcrypt.hash('123456', roundsOfHashing);
  const passwordUser2 = await bcrypt.hash('123456', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: {
      email: 'johndoe@mail.com',
    },
    update: {},
    create: {
      email: 'johndoe@mail.com',
      name: 'John Doe',
      password: passwordUser1,
    },
  });

  const user2 = await prisma.user.upsert({
    where: {
      email: 'jackdoe@mail.com',
    },
    update: {},
    create: {
      email: 'jackdoe@mail.com',
      name: 'Jack Doe',
      password: passwordUser2,
    },
  });

  const post1 = await prisma.article.upsert({
    where: { title: 'The new tech blog is online' },
    update: {},
    create: {
      title: 'Tech Blog is online',
      body: 'One of the most expected news of the year is now online...',
      description:
        'We are excited to share that today is the Tech Blog official release',
      published: false,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: 'New technologies for software development' },
    update: {},
    create: {
      title: 'New technologies for software development',
      body: 'Engineers have been working hard, issuing new releases with many improvements to these new technologies for software development...',
      description:
        'Learn about everything related to the new technologies for software development.',
      published: true,
      authorId: user2.id,
    },
  });

  console.log({ user1, user2, post1, post2 });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
