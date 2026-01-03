import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { addExercise, deleteWorkout } from "@/app/actions";

// Propsの型定義（paramsはPromiseとして受け取ります）
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkoutDetailPage({ params }: PageProps) {
  // 1. URLパラメータからIDを取り出す (Laravelの $id)
  const { id } = await params;
  
  // IDを数値に変換（URLパラメータは文字列のため）
  const workoutId = parseInt(id);

  // 👇 IDをあらかじめセットした「削除専用関数」を作る
  // 第1引数は null (thisのコンテキスト)、第2引数が deleteWorkout の第1引数になります
  const deleteWorkoutWithId = deleteWorkout.bind(null, workoutId);

  // 2. DBからデータを取得 (Laravelの Workout::with('exercises')->find($id))
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: {
      exercises: true, // リレーション先の種目も取得
    },
  });

  // データがなければ404ページへ (Laravelの abort(404))
  if (!workout) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-3xl font-bold">{workout.title}</h1>
        <form action={deleteWorkoutWithId}>
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            削除
          </button>
        </form>
      </div>
      <p className="text-gray-500 mb-8">
        日付: {workout.date.toLocaleDateString()}
      </p>

      {/* --- 既存の種目リスト --- */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">トレーニング内容</h2>
        {workout.exercises.length === 0 ? (
          <p className="text-gray-400">まだ種目が登録されていません</p>
        ) : (
          <ul className="space-y-3">
            {workout.exercises.map((ex) => (
              <li key={ex.id} className="border-b pb-2 last:border-0">
                <span className="font-bold text-lg">{ex.name}</span>
                <span className="ml-4 text-gray-600">
                  {ex.weight}kg × {ex.reps}回 × {ex.sets}セット
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- 種目追加フォーム --- */}
      <div className="bg-slate-50 p-6 rounded-lg border">
        <h3 className="text-lg font-bold mb-4">種目を追加する</h3>
        
        {/* Server Actionに hidden input でIDを渡します */}
        <form action={addExercise} className="flex gap-2 items-end flex-wrap">
          <input type="hidden" name="workoutId" value={workout.id} />
          
          <div>
            <label className="block text-xs text-gray-500">種目名</label>
            <input name="name" type="text" placeholder="例: スクワット" required className="border p-2 rounded w-40" />
          </div>
          <div>
            <label className="block text-xs text-gray-500">重量(kg)</label>
            <input name="weight" type="number" placeholder="60" required className="border p-2 rounded w-20" />
          </div>
          <div>
            <label className="block text-xs text-gray-500">回数</label>
            <input name="reps" type="number" placeholder="10" required className="border p-2 rounded w-16" />
          </div>
          <div>
            <label className="block text-xs text-gray-500">セット</label>
            <input name="sets" type="number" placeholder="3" required className="border p-2 rounded w-16" />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            追加
          </button>
        </form>
      </div>
    </div>
  );
}
