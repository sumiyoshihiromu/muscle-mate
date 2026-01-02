import { createWorkout } from "@/app/actions"; // さっき作った関数をインポート
import Link from "next/link";

export default function CreateWorkoutPage() {
  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">トレーニング記録をつける</h1>
      
      {/* Laravel: <form method="POST" action="/workouts"> 
        Next.js: action属性に「関数」を直接渡します
      */}
      <form action={createWorkout} className="space-y-4">
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            タイトル（例：胸の日、夜のランニング）
          </label>
          <input
            type="text"
            id="title"
            name="title" // これが formData.get('title') のキーになります
            required
            className="w-full border rounded px-3 py-2"
            placeholder="今日のトレーニング..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700"
          >
            記録する
          </button>
          
          <Link 
            href="/" 
            className="px-4 py-2 text-slate-600 hover:text-slate-800"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
