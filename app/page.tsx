import { prisma } from "@/lib/prisma"; // さっき作ったDB接続ツール

export default async function Home() {
  // サーバーサイドでデータを取得（LaravelのController内の処理に相当）
  // User::with('workouts.exercises')->first() のようなイメージ
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
    include: {
      workouts: {
        include: { exercises: true },
        orderBy: { date: 'desc' } // 新しい順
      }
    }
  });

  if (!user) {
    return <div>ユーザーが見つかりません</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{user.name}さんのトレーニング記録</h1>

      <div className="grid gap-4">
        {user.workouts.map((workout) => (
          // Laravelの @foreach ($user->workouts as $workout) に相当
          <div key={workout.id} className="border p-4 rounded-lg shadow bg-white">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{workout.title}</h2>
              <span className="text-sm text-gray-500">
                {workout.date.toLocaleDateString()}
              </span>
            </div>

            <ul className="list-disc list-inside">
              {workout.exercises.map((exercise) => (
                // ネストしたループ @foreach ($workout->exercises as $exercise)
                <li key={exercise.id} className="text-gray-700">
                  {exercise.name}: {exercise.weight}kg × {exercise.reps}回 × {exercise.sets}セット
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
