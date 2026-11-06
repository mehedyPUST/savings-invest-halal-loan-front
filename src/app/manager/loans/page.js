'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { loansAPI } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import { format } from 'date-fns';

export default function ManagerLoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [action, setAction] = useState(null); // { type, loanId }
  const [fundPassword, setFundPassword] = useState('');
  const [installmentsText, setInstallmentsText] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [repayNote, setRepayNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = filter === 'all' ? {} : { status: filter };
      const { data } = await loansAPI.list(params);
      setLoans(data.loans || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const doAction = async (type, id, extra = {}) => {
    setSubmitting(true);
    setMessage('');
    try {
      let res;
      if (type === 'start-voting') res = await loansAPI.startVoting(id);
      else if (type === 'finalize') res = await loansAPI.finalize(id);
      else if (type === 're-vote') res = await loansAPI.reVote(id);
      else if (type === 'disburse') {
        let installments = [];
        if (installmentsText.trim()) {
          installments = installmentsText
            .trim()
            .split('\n')
            .map((line) => {
              const [dueDate, amount] = line.split(',').map((s) => s.trim());
              return { dueDate, amount: Number(amount) };
            })
            .filter((i) => i.dueDate && i.amount);
        }
        res = await loansAPI.disburse(id, { fundPassword, installments, note: extra.note || '' });
      } else if (type === 'repay') {
        res = await loansAPI.repay(id, {
          amount: Number(repayAmount),
          note: repayNote,
          fundPassword,
        });
      }
      setMessage(res.data.message);
      setAction(null);
      setFundPassword('');
      setInstallmentsText('');
      setRepayAmount('');
      setRepayNote('');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell requireRole="manager">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Loan Applications (Qard Hasan)</h1>
        <p className="text-slate-500 text-sm mt-1">
          Interest-free only. Voting ≥67%. Disburse & record principal repayments.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'pending', 'voting', 'approved', 'rejected', 'disbursed', 'repaying', 'completed'].map((f) => (
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

      {/* Disburse panel */}
      {action?.type === 'disburse' && (
        <div className="card p-5 mb-6 border-primary-200 bg-primary-50/20">
          <h3 className="font-semibold mb-3">Disburse Loan — principal only (requires fund password)</h3>
          <div className="grid gap-3 max-w-lg">
            <div>
              <label className="label">Fund Action Password</label>
              <input type="password" className="input" value={fundPassword} onChange={(e) => setFundPassword(e.target.value)} />
            </div>
            <div>
              <label className="label">Installments (optional, one per line: YYYY-MM-DD,amount) — must sum to principal</label>
              <textarea
                className="input font-mono text-xs"
                rows={4}
                value={installmentsText}
                onChange={(e) => setInstallmentsText(e.target.value)}
                placeholder="2026-12-01,5000&#10;2027-01-01,5000"
              />
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" disabled={submitting} onClick={() => doAction('disburse', action.loanId)}>
                {submitting && <Spinner className="h-4 w-4" />} Disburse & Deduct from Fund
              </button>
              <button className="btn-secondary" onClick={() => setAction(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Repay panel */}
      {action?.type === 'repay' && (
        <div className="card p-5 mb-6 border-emerald-200 bg-emerald-50/30">
          <h3 className="font-semibold mb-3">Record Repayment — principal only (Riba-free)</h3>
          <p className="text-sm text-slate-600 mb-3">Money returns to the central fund. No interest or extra charge.</p>
          <div className="grid gap-3 max-w-lg">
            <div>
              <label className="label">Amount (৳)</label>
              <input type="number" className="input" value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} min="1" />
            </div>
            <div>
              <label className="label">Note (optional)</label>
              <input className="input" value={repayNote} onChange={(e) => setRepayNote(e.target.value)} />
            </div>
            <div>
              <label className="label">Fund Action Password</label>
              <input type="password" className="input" value={fundPassword} onChange={(e) => setFundPassword(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" disabled={submitting} onClick={() => doAction('repay', action.loanId)}>
                {submitting && <Spinner className="h-4 w-4" />} Record Repayment
              </button>
              <button className="btn-secondary" onClick={() => setAction(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      ) : loans.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">No loans found.</div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => {
            const remaining = loan.amount - (loan.totalRepaid || 0);
            return (
              <div key={loan._id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-lg">
                      {loan.memberName} — ৳{loan.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">{loan.purpose || '—'}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {format(new Date(loan.createdAt), 'dd MMM yyyy HH:mm')}
                    </p>
                    {(loan.totalRepaid > 0 || loan.status === 'repaying' || loan.status === 'completed') && (
                      <p className="text-sm mt-1 text-slate-600">
                        Repaid: ৳{(loan.totalRepaid || 0).toLocaleString()} · Remaining: ৳{remaining.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={
                      loan.status === 'approved' || loan.status === 'disbursed' || loan.status === 'completed'
                        ? 'badge-green'
                        : loan.status === 'voting' || loan.status === 'repaying'
                        ? 'badge-blue'
                        : loan.status === 'rejected'
                        ? 'badge-red'
                        : 'badge-yellow'
                    }
                  >
                    {loan.status}
                  </span>
                </div>

                {(loan.status === 'voting' || loan.yesCount > 0) && (
                  <div className="mt-3 flex gap-4 text-sm text-slate-600">
                    <span>Yes: <strong>{loan.yesCount}</strong></span>
                    <span>No: <strong>{loan.noCount}</strong></span>
                    <span>Approval: <strong>{loan.approvalPercentage}%</strong> (need ≥67%)</span>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {loan.status === 'pending' && (
                    <button className="btn-primary text-sm" onClick={() => doAction('start-voting', loan._id)} disabled={submitting}>
                      Start Voting
                    </button>
                  )}
                  {loan.status === 'voting' && (
                    <>
                      <button className="btn-primary text-sm" onClick={() => doAction('finalize', loan._id)} disabled={submitting}>
                        Finalize Voting
                      </button>
                      <button className="btn-secondary text-sm" onClick={() => doAction('re-vote', loan._id)} disabled={submitting}>
                        Open Re-vote
                      </button>
                    </>
                  )}
                  {loan.status === 'rejected' && (
                    <button className="btn-secondary text-sm" onClick={() => doAction('re-vote', loan._id)} disabled={submitting}>
                      Open Re-vote
                    </button>
                  )}
                  {loan.status === 'approved' && (
                    <button className="btn-primary text-sm" onClick={() => setAction({ type: 'disburse', loanId: loan._id })}>
                      Disburse Loan
                    </button>
                  )}
                  {(loan.status === 'disbursed' || loan.status === 'repaying') && remaining > 0 && (
                    <button
                      className="btn-primary text-sm"
                      onClick={() => {
                        setAction({ type: 'repay', loanId: loan._id });
                        setRepayAmount(String(remaining));
                      }}
                    >
                      Record Repayment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
