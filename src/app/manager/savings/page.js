'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { savingsAPI } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import { format } from 'date-fns';

export default function ManagerSavingsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [actionId, setActionId] = useState(null);
  const [fundPassword, setFundPassword] = useState('');
  const [denyReason, setDenyReason] = useState('');
  const [mode, setMode] = useState(null); // 'confirm' | 'deny'
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = filter === 'all' ? {} : { status: filter };
      const { data } = await savingsAPI.list(params);
      setRequests(data.requests || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const openConfirm = (id) => {
    setActionId(id);
    setMode('confirm');
    setFundPassword('');
    setMessage('');
  };

  const openDeny = (id) => {
    setActionId(id);
    setMode('deny');
    setDenyReason('');
    setMessage('');
  };

  const handleConfirm = async () => {
    if (!fundPassword) {
      setMessage('Fund action password is required');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await savingsAPI.confirm(actionId, fundPassword);
      setMessage(data.message);
      setMode(null);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeny = async () => {
    if (!denyReason || denyReason.trim().length < 3) {
      setMessage('Please provide a reason');
      return;
    }
    setSubmitting(true);
    try {
      await savingsAPI.deny(actionId, denyReason);
      setMessage('Request denied and member notified');
      setMode(null);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell requireRole="manager">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Savings Requests</h1>
        <p className="text-slate-500 text-sm mt-1">Confirm or deny member placement requests</p>
      </div>

      <div className="flex gap-2 mb-4">
        {['pending', 'confirmed', 'denied', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
              filter === f
                ? 'bg-primary-700 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {/* Modal-like action panel */}
      {mode && (
        <div className="card p-5 mb-6 border-primary-200 bg-primary-50/30">
          <h3 className="font-semibold text-slate-900 mb-3">
            {mode === 'confirm' ? 'Confirm Saving (adds to fund)' : 'Deny Request'}
          </h3>
          {mode === 'confirm' ? (
            <div className="space-y-3 max-w-md">
              <div>
                <label className="label">Fund Action Password</label>
                <input
                  type="password"
                  className="input"
                  value={fundPassword}
                  onChange={(e) => setFundPassword(e.target.value)}
                  placeholder="Required for balance change"
                />
              </div>
              <div className="flex gap-2">
                <button className="btn-primary" onClick={handleConfirm} disabled={submitting}>
                  {submitting && <Spinner className="h-4 w-4" />} Confirm & Add to Fund
                </button>
                <button className="btn-secondary" onClick={() => setMode(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-w-md">
              <div>
                <label className="label">Reason for denial</label>
                <textarea
                  className="input"
                  rows={3}
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  placeholder="e.g. Wrong transaction ID, amount mismatch..."
                />
              </div>
              <div className="flex gap-2">
                <button className="btn-danger" onClick={handleDeny} disabled={submitting}>
                  {submitting && <Spinner className="h-4 w-4" />} Deny & Notify
                </button>
                <button className="btn-secondary" onClick={() => setMode(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      ) : requests.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">No requests found.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Member</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Method / Trx</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r._id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{r.memberName}</p>
                    <p className="text-xs text-slate-500">{r.memberEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold">৳{r.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize">{r.method}</span>
                    {r.transactionId && (
                      <p className="text-xs text-slate-500">{r.transactionId}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {format(new Date(r.createdAt), 'dd MMM yyyy HH:mm')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        r.status === 'pending'
                          ? 'badge-yellow'
                          : r.status === 'confirmed'
                          ? 'badge-green'
                          : 'badge-red'
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          className="text-emerald-700 hover:underline font-medium text-sm"
                          onClick={() => openConfirm(r._id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="text-red-600 hover:underline font-medium text-sm"
                          onClick={() => openDeny(r._id)}
                        >
                          Deny
                        </button>
                      </div>
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
