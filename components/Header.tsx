import Link from 'next/link';
import { auth, signOut } from '@/auth';

export default async function Header() {
  const session = await auth();
  
  return (
    <header className="bg-slate-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Muscle Mate
        </Link>
        
        <ul className="flex space-x-4 items-center">
          {session ? (
            // ログイン中の表示
            <>
              <li className="text-sm text-slate-300">
                {session.user?.name} さん
              </li>
              <li>
                {/* ログアウトボタン（Server Action） */}
                <form
                  action={async () => {
                    'use server';
                    await signOut();
                  }}
                >
                  <button className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600">
                    ログアウト
                  </button>
                </form>
              </li>
            </>
          ) : (
            // ログアウト中の表示
            <>
              <li>
                <Link href="/login" className="hover:text-slate-300">
                  ログイン
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
