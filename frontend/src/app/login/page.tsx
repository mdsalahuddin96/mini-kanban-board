'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lip/api';


export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const data = await fetcher(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">
          {isLogin ? 'Login to Kanban' : 'Create Account'}
        </h2>

        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded font-semibold transition">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}