import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/'); 
      const isOnLogin = nextUrl.pathname.startsWith('/login');

      // ログインページにいる場合
      if (isOnLogin) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
        return true;
      }

      // ダッシュボード（保護されたページ）にいる場合
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // ログイン画面へリダイレクト
      }
      return true;
    },
  },
  providers: [], // ここでは空にしておきます（auth.tsで追加）
} satisfies NextAuthConfig;
