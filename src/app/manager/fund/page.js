'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { fundAPI } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import { format } from 'date-fns';

export default function ManagerFundPage() {
  const [fund, setFund] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targets, setTargets] = useState({ targetAmount: '', targetDate: '', status: 'collecting' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const [f, h] = await Promise.all([fundAPI.get(), fundAPI.history()]);
      setFund(f.data.fund);
      setHistory(h.data.history || []);
      setTargets({
        targetAmount: f.data.fund?.targetAmount || '',
        targetDate: f.data.fund?.targetDate
          ? new Date(f.data.fund.targetDate).toISOString().slice(0, 10)
          : '',
        status: f.data.fund?.status || 'collecting',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdateTargets = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await fundAPI.updateTargets({
        targetAmount: Number(targets.targetAmount) || 0,
        targetDate: targets.targetDate || null,
        status: targets.status,
      });
      setMessage('Targets updated');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell requireRole="manager">
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell requireRole="manager">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Fund Overview & History</h1>
        <p className="text-slate-500 text-sm mt-1">Central fund balance and all balance-changing actions</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Current Balance</p>
          <p className="text-3xl font-bold text-primary-700 mt-1">
            ৳{(fund?.balance || 0).toLocaleString()}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Total Saved (All Time)</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            ৳{(fund?.totalSavedAllTime || 0).toLocaleString()}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Total Loaned (All Time)</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            ৳{(fund?.totalLoanedAllTime || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Targets */}
      <div className="card p-6 mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">Fund Targets & Status</h2>
        {message && (
          <div className="mb-3 text-sm text-emerald-700">{message}</div>
        )}
        <form onSubmit={handleUpdateTargets} className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Target Amount (৳)</label>
            <input
              type="number"
              className="input"
              value={targets.targetAmount}
              onChange={(e) => setTargets({ ...targets, targetAmount: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Target Date</label>
            <input
              type="date"
              className="input"
              value={targets.targetDate}
              onChange={(e) => setTargets({ ...targets, targetDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={targets.status}
              onChange={(e) => setTargets({ ...targets, status: e.target.value })}
            >
              <option value="collecting">Collecting</option>
              <option value="ready_to_invest">Ready to Invest</option>
              <option value="invested">Invested</option>
            </select>
          </div>
          <div className="sm:col-span-3">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving && <Spinner className="h-4 w-4" />} Update Targets
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Fund History (last 100)</h2>
        </div>
        {history.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No transactions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Balance After</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((h) => (
                <tr key={h._id}>
                  <td className="px-4 py-3 text-slate-600">
                    {format(new Date(h.createdAt), 'dd MMM yyyy HH:mm')}
                  </td>
                  <td className="px-4 py-3 capitalize">{h.type?.replace(/_/g, ' ')}</td>
                  <td className={`px-4 py-3 font-medium ${h.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {h.amount >= 0 ? '+' : ''}৳{Math.abs(h.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">৳{(h.balanceAfter || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{h.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}
