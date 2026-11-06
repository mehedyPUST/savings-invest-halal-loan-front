'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';

export default function BootstrapPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.bootstrapManager(form);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create manager');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-700 text-white font-bold text-xl mb-3">
            CF
          </div>
          <h1 className="text-xl font-bold text-slate-900">Create First Manager</h1>
          <p className="text-sm text-slate-500 mt-1">
            This page works only when no users exist yet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="label">Full Name</label>
            <input name="name" className="input" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" className="input" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input name="phone" className="input" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" className="input" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading && <Spinner className="h-4 w-4" />}
            Create Manager Account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          <Link href="/login" className="text-primary-700 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
