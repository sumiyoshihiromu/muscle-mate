import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-slate-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Muscle Mate
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/login" className="hover:text-slate-300">
              ログイン
            </Link>
          </li>
          <li>
            <Link href="/register" className="bg-white text-slate-800 px-4 py-2 rounded hover:bg-slate-200">
              登録
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
