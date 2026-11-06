'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden p-12 flex-col justify-between text-white">
        <img
          src="/banner.png"
          alt="Qard Hasan Banking"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/85 via-primary-900/75 to-teal-900/60" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur font-bold text-xl">
              CF
            </div>
            <span className="text-2xl font-semibold">Cooperative Fund</span>
          </div>
          <p className="mt-2 text-primary-100">Qard Hasan Management System</p>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight drop-shadow-sm">
            Transparent savings.<br />Interest-free loans.<br />Shared trust.
          </h1>
          <p className="mt-4 text-primary-50/95 max-w-md">
            Manage monthly contributions, central fund, and member voting for Qard Hasan loans — all in one modern platform.
          </p>
        </div>
        <p className="relative z-10 text-sm text-primary-100/80">Built for cooperatives of ~20 members</p>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-700 text-white font-bold text-xl mb-3">
              CF
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Cooperative Fund</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-1 text-slate-500">Welcome back. Please enter your details.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label" htmlFor="password">Password</label>
                <Link href="/forgot-password" className="text-xs font-medium text-primary-700 hover:text-primary-800">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Spinner className="h-4 w-4" /> : null}
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            First time setup?{' '}
            <Link href="/bootstrap" className="font-medium text-primary-700 hover:text-primary-800">
              Create manager account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
