'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { usersAPI, authAPI } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';

export default function ManagerMembersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    monthlySavingAmount: '',
    role: 'member',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const { data } = await usersAPI.list();
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await authAPI.register({
        ...form,
        monthlySavingAmount: Number(form.monthlySavingAmount) || 0,
      });
      setMessage('Member created successfully');
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', phone: '', monthlySavingAmount: '', role: 'member' });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id, current) => {
    try {
      await usersAPI.updateStatus(id, !current);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppShell requireRole="manager">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Members</h1>
          <p className="text-slate-500 text-sm mt-1">Manage cooperative members (~20 expected)</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          Add Member
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {showAdd && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-4">Register New Member</h2>
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Monthly Saving Amount (৳)</label>
              <input type="number" className="input" value={form.monthlySavingAmount} onChange={(e) => setForm({ ...form, monthlySavingAmount: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="member">Member</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting && <Spinner className="h-4 w-4" />} Create
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Email</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Role</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Monthly</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Total Saved</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">৳{(u.monthlySavingAmount || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">৳{(u.totalSaved || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={u.isActive ? 'badge-green' : 'badge-red'}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-sm text-primary-700 hover:underline"
                      onClick={() => toggleStatus(u._id, u.isActive)}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
