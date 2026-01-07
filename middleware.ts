// middleware.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // api, staticファイル, 画像などを除外する設定
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
