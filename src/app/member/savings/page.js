'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { savingsAPI } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import { format } from 'date-fns';

const statusBadge = {
  pending: 'badge-yellow',
  confirmed: 'badge-green',
  denied: 'badge-red',
};

export default function MemberSavingsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: '', method: 'bkash', transactionId: '', note: '' });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const { data } = await savingsAPI.list();
      setRequests(data.requests || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      if (editingId) {
        await savingsAPI.updateRequest(editingId, form);
        setMessage('Request updated and sent for re-review.');
      } else {
        await savingsAPI.createRequest(form);
        setMessage('Saving request submitted successfully.');
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ amount: '', method: 'bkash', transactionId: '', note: '' });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (req) => {
    setForm({
      amount: req.amount,
      method: req.method,
      transactionId: req.transactionId || '',
      note: req.note || '',
    });
    setEditingId(req._id);
    setShowForm(true);
  };

  return (
    <AppShell requireRole="member">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Savings</h1>
          <p className="text-slate-500 text-sm mt-1">Submit placement requests after transferring money</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm({ amount: '', method: 'bkash', transactionId: '', note: '' });
          }}
        >
          New Request
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            {editingId ? 'Update Saving Request' : 'New Saving Placement Request'}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Amount (৳)</label>
              <input
                type="number"
                className="input"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                min="1"
              />
            </div>
            <div>
              <label className="label">Method</label>
              <select
                className="input"
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash / Hand</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Transaction ID</label>
              <input
                className="input"
                value={form.transactionId}
                onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                placeholder="e.g. TXN123456"
              />
            </div>
            <div>
              <label className="label">Note (optional)</label>
              <input
                className="input"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting && <Spinner className="h-4 w-4" />}
                {editingId ? 'Update & Resubmit' : 'Submit Request'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
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
      ) : requests.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          No saving requests yet. Click “New Request” after you transfer money.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Method</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Trx ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-600">
                    {format(new Date(r.createdAt), 'dd MMM yyyy')}
                  </td>
                  <td className="px-4 py-3 font-medium">৳{r.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 capitalize">{r.method}</td>
                  <td className="px-4 py-3 text-slate-500">{r.transactionId || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={statusBadge[r.status] || 'badge-gray'}>{r.status}</span>
                    {r.denialReason && (
                      <p className="text-xs text-red-600 mt-1 max-w-[180px]">{r.denialReason}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {(r.status === 'denied' || r.status === 'pending') && (
                      <button
                        className="text-primary-700 hover:underline text-sm font-medium"
                        onClick={() => startEdit(r)}
                      >
                        Edit
                      </button>
                    )}
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
