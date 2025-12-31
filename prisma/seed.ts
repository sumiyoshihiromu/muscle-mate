import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. ユーザーを作成
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'テストユーザー',
      workouts: {
        create: [
          {
            title: '胸の日（ベンチプレス強化）',
            exercises: {
              create: [
                { name: 'ベンチプレス', weight: 60, reps: 10, sets: 3 },
                { name: 'ダンベルフライ', weight: 12, reps: 12, sets: 3 },
              ]
            }
          },
          {
            title: '背中の日',
            exercises: {
              create: [
                { name: 'デッドリフト', weight: 80, reps: 8, sets: 3 },
                { name: '懸垂', weight: 0, reps: 10, sets: 3 },
              ]
            }
          }
        ]
      }
    },
  });

  console.log({ user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
