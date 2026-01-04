// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs'; // 👈 インポート忘れずに

const prisma = new PrismaClient();

async function main() {
  // パスワードをハッシュ化
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {
      password: hashedPassword, // 既存データの更新時もパスワードを入れる
    },
    create: {
      email: 'test@example.com',
      name: 'テストユーザー',
      password: hashedPassword, // 👈 【ここがエラーの原因でした】必須なので追加
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
