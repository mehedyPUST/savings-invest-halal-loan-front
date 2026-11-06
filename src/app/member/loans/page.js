'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { loansAPI } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import { format } from 'date-fns';

const statusMap = {
  pending: 'badge-yellow',
  voting: 'badge-blue',
  approved: 'badge-green',
  rejected: 'badge-red',
  disbursed: 'badge-green',
  repaying: 'badge-blue',
  completed: 'badge-gray',
};

export default function MemberLoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: '', purpose: '', preferredInstallments: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [reportMsg, setReportMsg] = useState('');

  const load = async () => {
    try {
      const { data } = await loansAPI.list();
      setLoans(data.loans || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await loansAPI.apply({
        amount: Number(form.amount),
        purpose: form.purpose,
        preferredInstallments: form.preferredInstallments ? Number(form.preferredInstallments) : 0,
      });
      setMessage('Loan application submitted. Manager will start voting soon.');
      setShowForm(false);
      setForm({ amount: '', purpose: '', preferredInstallments: '' });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReceipt = async () => {
    setSubmitting(true);
    try {
      await loansAPI.confirmReceipt(confirmId, { reportMessage: reportMsg });
      setMessage('Receipt confirmed.');
      setConfirmId(null);
      setReportMsg('');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell requireRole="member">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Loans (Qard Hasan)</h1>
          <p className="text-slate-500 text-sm mt-1">Interest-free. Max 3 per year. No active loan required.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Apply for Loan
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-4">New Loan Application</h2>
          <form onSubmit={handleApply} className="grid gap-4 sm:grid-cols-2">
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
              <label className="label">Preferred Installments (optional)</label>
              <input
                type="number"
                className="input"
                value={form.preferredInstallments}
                onChange={(e) => setForm({ ...form, preferredInstallments: e.target.value })}
                min="1"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Purpose</label>
              <textarea
                className="input"
                rows={2}
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                placeholder="Brief reason for the loan"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting && <Spinner className="h-4 w-4" />} Submit Application
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmId && (
        <div className="card p-5 mb-6 border-primary-200">
          <h3 className="font-semibold mb-2">Confirm Loan Receipt</h3>
          <p className="text-sm text-slate-600 mb-3">
            Have you received the money? You may optionally report an issue (fund balance will not reverse).
          </p>
          <textarea
            className="input mb-3"
            rows={2}
            placeholder="Optional report / issue note"
            value={reportMsg}
            onChange={(e) => setReportMsg(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="btn-primary" onClick={handleConfirmReceipt} disabled={submitting}>
              {submitting && <Spinner className="h-4 w-4" />} Confirm Receipt
            </button>
            <button className="btn-secondary" onClick={() => setConfirmId(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      ) : loans.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">No loan applications yet.</div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan._id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">৳{loan.amount.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">{loan.purpose || 'No purpose noted'}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Applied {format(new Date(loan.createdAt), 'dd MMM yyyy')}
                  </p>
                </div>
                <span className={statusMap[loan.status] || 'badge-gray'}>{loan.status}</span>
              </div>

              {loan.status === 'voting' && (
                <p className="mt-3 text-sm text-slate-600">
                  Voting in progress — Yes: {loan.yesCount} | No: {loan.noCount} | Approval: {loan.approvalPercentage}%
                </p>
              )}

              {loan.status === 'disbursed' && !loan.receiptConfirmed && (
                <button
                  className="btn-primary mt-4"
                  onClick={() => setConfirmId(loan._id)}
                >
                  Confirm Receipt of Money
                </button>
              )}

              {loan.installments?.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <p className="text-sm font-medium text-slate-700 mb-2">Installments</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {loan.installments.map((inst) => (
                      <div key={inst.number} className="flex justify-between text-sm bg-slate-50 rounded-lg px-3 py-2">
                        <span>#{inst.number} — {format(new Date(inst.dueDate), 'dd MMM yyyy')}</span>
                        <span className="font-medium">৳{inst.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
