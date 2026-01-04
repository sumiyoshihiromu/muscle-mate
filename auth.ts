import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod'; // Next.js標準のバリデーションライブラリ

// 認証の設定
export const { handlers, auth, signIn, signOut } = NextAuth({
  // ログインページのカスタマイズ（後で作ります）
  pages: {
    signIn: '/login',
  },
  providers: [
    // メール/パスワード認証の設定
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // 1. バリデーション (Laravelの $request->validate)
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          // 2. ユーザー検索 (Laravelの User::where('email', $email)->first())
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) return null;

          // 3. パスワード照合 (Laravelの Hash::check)
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log('認証失敗');
        return null;
      },
    }),
  ],
  // セッションの設定（ログインユーザーの情報をどう保持するか）
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token.sub) {
        // セッションにユーザーIDを含める
        session.user.id = token.sub; 
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = String(user.id); // IDをJWTトークンに埋め込む
      }
      return token;
    },
  },
});
