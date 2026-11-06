'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { loansAPI } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export default function MemberVotePage() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(null);

  const load = async () => {
    try {
      const { data } = await loansAPI.list({ status: 'voting' });
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

  const handleVote = async (loanId, vote) => {
    setSubmitting(loanId);
    setMessage('');
    try {
      const { data } = await loansAPI.vote(loanId, vote);
      setMessage(data.message);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Vote failed');
    } finally {
      setSubmitting(null);
    }
  };

  const hasVoted = (loan) =>
    loan.votes?.some((v) => v.memberId === user?.id || v.memberId?.toString() === user?.id);

  return (
    <AppShell requireRole="member">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Voting</h1>
        <p className="text-slate-500 text-sm mt-1">
          Cast your vote on open loan applications. ≥67% yes required for approval.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      ) : loans.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          No open votes at the moment.
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => {
            const voted = hasVoted(loan);
            return (
              <div key={loan._id} className="card p-5">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <p className="font-semibold text-lg">
                      {loan.memberName} requests ৳{loan.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">{loan.purpose || 'No purpose given'}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Voting started {loan.votingStartedAt && format(new Date(loan.votingStartedAt), 'dd MMM yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p>Yes: <strong className="text-emerald-600">{loan.yesCount}</strong></p>
                    <p>No: <strong className="text-red-600">{loan.noCount}</strong></p>
                    <p className="text-slate-500">{loan.approvalPercentage}% of members</p>
                  </div>
                </div>

                {voted ? (
                  <p className="mt-4 text-sm text-primary-700 font-medium">You have already voted.</p>
                ) : (
                  <div className="mt-4 flex gap-3">
                    <button
                      className="btn-primary"
                      disabled={submitting === loan._id}
                      onClick={() => handleVote(loan._id, 'yes')}
                    >
                      {submitting === loan._id && <Spinner className="h-4 w-4" />} Approve (Yes)
                    </button>
                    <button
                      className="btn-danger"
                      disabled={submitting === loan._id}
                      onClick={() => handleVote(loan._id, 'no')}
                    >
                      Reject (No)
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
