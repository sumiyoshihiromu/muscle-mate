'use server'; // 👈 【最重要】このファイル内の関数はすべてサーバー側でのみ実行されるという宣言

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createWorkout(formData: FormData) {
  
  // 1. フォームデータの取得（$request->input('title')）
  const title = formData.get("title") as string;
  
  // 簡易バリデーション (Laravelの $request->validate(...))
  if (!title || title === "") {
    throw new Error("タイトルは必須です");
  }

  // 2. DB保存 (Eloquentの create)
  // 今回は簡略化のため、固定のユーザー(ID=1)に紐づけます
  // 本来はログインユーザーのIDを使います
  await prisma.workout.create({
    data: {
      title: title,
      userId: 1, // シーダーで作ったユーザーのID
      // 一旦エクササイズなしで「箱」だけ作ります
    },
  });

  // 3. キャッシュクリア (重要)
  // Next.jsはページを強力にキャッシュするため、「データが変わったからトップページを更新して」と伝えます
  revalidatePath("/");

  // 4. リダイレクト (Laravelの return redirect('/'))
  redirect("/");
}

export async function addExercise(formData: FormData) {
  // フォームから値を取得
  const workoutId = parseInt(formData.get("workoutId") as string);
  const name = formData.get("name") as string;
  const weight = parseFloat(formData.get("weight") as string);
  const reps = parseInt(formData.get("reps") as string);
  const sets = parseInt(formData.get("sets") as string);

  // DBに保存
  await prisma.exercise.create({
    data: {
      name,
      weight,
      reps,
      sets,
      workoutId, // どのWorkoutに紐づくか
    },
  });

  // 画面更新
  // 特定のパスのキャッシュだけを更新します
  revalidatePath(`/workouts/${workoutId}`);
  
  // ※今回はリダイレクトせず、そのまま同じページに留まります
}
