import { authenticate } from '@/app/actions';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
        
        <form action={authenticate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              name="email"
              placeholder="test@example.com"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード</label>
            <input
              type="password"
              name="password"
              placeholder="password123"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
