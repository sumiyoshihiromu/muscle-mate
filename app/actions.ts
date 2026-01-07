'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function createWorkout(formData: FormData) {
  
  // 1. フォームデータの取得
  const title = formData.get("title") as string;
  
  // 簡易バリデーション
  if (!title || title === "") {
    throw new Error("タイトルは必須です");
  }

  // DB保存
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

// エクササイズ追加処理
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

// 削除処理
export async function deleteWorkout(id: number) {
  
  // 2. DBから削除 (Laravel: Workout::destroy($id))
  // 関連するExerciseも消す必要がありますが、
  // Prismaのschemaで `onDelete: Cascade` を設定していない場合、手動で消すか、トランザクションが必要です。
  // 今回は単純化のため、Prismaがエラーを吐かないよう「関連データごと削除」を設定します。
  
  // ※本来は schema.prisma で onDelete: Cascade を設定するのがベストですが、
  // ここではコードで解決する transaction を使ってみましょう。
  await prisma.$transaction([
    prisma.exercise.deleteMany({ where: { workoutId: id } }), // 子供を先に消す
    prisma.workout.delete({ where: { id } }),                 // 親を消す
  ]);

  // 3. キャッシュクリアとリダイレクト
  // 詳細ページを消したので、トップページに戻します
  revalidatePath("/");
  redirect("/");
}

// ログイン
export async function authenticate(formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'メールアドレスまたはパスワードが間違っています。';
        default:
          return 'エラーが発生しました。';
      }
    }
    // Next.jsの仕様上、リダイレクトはエラーとして投げられるので、
    // AuthError以外はそのまま再スローする必要があります。
    throw error;
  }
}
