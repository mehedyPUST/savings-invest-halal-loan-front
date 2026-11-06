'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { fundAPI, savingsAPI, loansAPI } from '@/lib/api';
import {
  PiggyBank,
  HandCoins,
  Users,
  Clock,
  Target,
  Activity,
} from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import Link from 'next/link';

function DiagnosticCard({ title, value, sub, status, statusTone = 'green', icon: Icon, meta }) {
  const tones = {
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    sky: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    slate: 'bg-slate-100 text-slate-600 ring-slate-500/10',
    red: 'bg-red-50 text-red-700 ring-red-600/20',
  };
  return (
    <div className="card p-5 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
          {sub && <p className="mt-1.5 text-sm text-slate-600 leading-snug">{sub}</p>}
        </div>
        {status && (
          <span
            className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[statusTone]}`}
          >
            {status}
          </span>
        )}
      </div>
      {meta && (
        <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
          {meta}
        </p>
      )}
    </div>
  );
}

function MetricCard({ title, value, sub, accent = 'slate' }) {
  const accents = {
    slate: 'border-slate-100 bg-white',
    purple: 'border-violet-100 bg-violet-50/40',
    green: 'border-emerald-100 bg-emerald-50/40',
    sky: 'border-sky-100 bg-sky-50/40',
    amber: 'border-amber-100 bg-amber-50/40',
    teal: 'border-primary-100 bg-primary-50/40',
  };
  return (
    <div className={`rounded-xl border p-4 ${accents[accent]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1.5 text-xl font-bold text-slate-900 tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isManager } = useAuth();
  const [fund, setFund] = useState(null);
  const [pendingSavings, setPendingSavings] = useState(0);
  const [pendingLoans, setPendingLoans] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [fundRes, savingsRes, loansRes] = await Promise.all([
          fundAPI.get(),
          savingsAPI.list(isManager ? { status: 'pending' } : {}),
          loansAPI.list(isManager ? { status: 'pending' } : {}),
        ]);
        setFund(fundRes.data.fund);
        setPendingSavings(savingsRes.data.requests?.length || 0);
        setPendingLoans(loansRes.data.loans?.length || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isManager]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      </AppShell>
    );
  }

  const balance = fund?.balance || 0;
  const totalSaved = fund?.totalSavedAllTime || 0;
  const totalLoaned = fund?.totalLoanedAllTime || 0;
  const members = fund?.memberCount || 0;
  const monthlyPotential = fund?.totalMonthlyPotential || 0;
  const target = fund?.targetAmount || 0;
  const progressPct = target > 0 ? Math.min(100, (balance / target) * 100) : 0;
  const fundStatus = fund?.status === 'collecting' ? 'Collecting' : fund?.status || 'Active';

  return (
    <AppShell>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">
          Welcome back, <span className="font-medium text-slate-800">{user?.name?.split(' ')[0]}</span>
          {' · '}
          {isManager ? 'Manager overview' : 'Your savings & loan status'}
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <Activity className="h-3.5 w-3.5" />
          Live fund snapshot
        </span>
      </div>

      {/* Top diagnostic row – 4 grid */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Fund diagnostics &amp; summary
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DiagnosticCard
            title="Central Fund Balance"
            value={`৳${balance.toLocaleString()}`}
            sub={
              fund?.status === 'collecting'
                ? 'Currently in collecting phase'
                : 'Available for operations'
            }
            status={fundStatus}
            statusTone={fund?.status === 'collecting' ? 'amber' : 'green'}
            meta={
              target > 0 ? (
                <>
                  <Target className="h-3.5 w-3.5" />
                  Target ৳{target.toLocaleString()} · {progressPct.toFixed(0)}% reached
                </>
              ) : (
                'No target set'
              )
            }
          />
          <DiagnosticCard
            title="Total Saved (All Time)"
            value={`৳${totalSaved.toLocaleString()}`}
            sub="Cumulative member contributions"
            status="Healthy"
            statusTone="green"
            meta={
              <>
                <PiggyBank className="h-3.5 w-3.5" />
                Potential monthly ৳{monthlyPotential.toLocaleString()}
              </>
            }
          />
          <DiagnosticCard
            title="Total Loaned"
            value={`৳${totalLoaned.toLocaleString()}`}
            sub="Interest-free Qard Hasan disbursed"
            status={pendingLoans > 0 ? `${pendingLoans} pending` : 'Clear'}
            statusTone={pendingLoans > 0 ? 'amber' : 'green'}
            meta={
              <>
                <HandCoins className="h-3.5 w-3.5" />
                Max 3 loans per member / year
              </>
            }
          />
          <DiagnosticCard
            title="Active Members"
            value={members}
            sub="Registered cooperative members"
            status={isManager && pendingSavings > 0 ? `${pendingSavings} pending` : 'Synced'}
            statusTone={isManager && pendingSavings > 0 ? 'sky' : 'slate'}
            meta={
              <>
                <Users className="h-3.5 w-3.5" />
                Role: {isManager ? 'Manager' : 'Member'}
              </>
            }
          />
        </div>
      </section>

      {/* Secondary metrics row – 6-style compact cards */}
      <section className="mb-8">
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <MetricCard
            title="True peak demand"
            value={`৳${balance.toLocaleString()}`}
            sub="Current balance"
            accent="purple"
          />
          <MetricCard
            title="Supplied peak"
            value={`৳${totalSaved.toLocaleString()}`}
            sub="All-time saved"
            accent="green"
          />
          <MetricCard
            title="Mean contribution"
            value={
              members > 0
                ? `৳${Math.round(totalSaved / members).toLocaleString()}`
                : '—'
            }
            sub="Per member (lifetime)"
            accent="sky"
          />
          <MetricCard
            title="Pending actions"
            value={isManager ? pendingSavings + pendingLoans : '—'}
            sub={isManager ? 'Savings + loans' : 'Manager view'}
            accent="amber"
          />
          <MetricCard
            title="Load factor"
            value={target > 0 ? `${progressPct.toFixed(0)}%` : '—'}
            sub="Toward fund target"
            accent="teal"
          />
          <MetricCard
            title="Your role"
            value={isManager ? 'Manager' : 'Member'}
            sub={user?.email?.split('@')[0] || 'Account'}
            accent="slate"
          />
        </div>
      </section>

      {/* Quick actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {isManager ? (
          <>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">Pending Savings</h2>
                <span className="badge-yellow">{pendingSavings} pending</span>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                Members have submitted saving placement requests awaiting your confirmation.
              </p>
              <Link href="/manager/savings" className="btn-primary">
                Review Savings
              </Link>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">Loan Applications</h2>
                <span className="badge-blue">{pendingLoans} pending</span>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                New Qard Hasan applications waiting for voting to be started.
              </p>
              <Link href="/manager/loans" className="btn-primary">
                Manage Loans
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 mb-2">Your Contribution</h2>
              <p className="text-3xl font-bold text-primary-700">
                ৳{(user?.totalSaved || 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Monthly target: ৳{(user?.monthlySavingAmount || 0).toLocaleString()}
              </p>
              <Link href="/member/savings" className="btn-primary mt-4 inline-flex">
                Submit Saving Request
              </Link>
            </div>
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 mb-2">Loan Eligibility</h2>
              <p className="text-sm text-slate-600 mb-1">
                Loans taken this year: <strong>{user?.loansTakenThisYear || 0} / 3</strong>
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Interest-free Qard Hasan. Max 3 per year. No active loan required.
              </p>
              <Link href="/member/loans" className="btn-secondary">
                View / Apply for Loan
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Fund target progress */}
      {target > 0 && (
        <div className="card p-6 mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-900">Fund Target Progress</h2>
            <span className="text-sm text-slate-500">
              ৳{balance.toLocaleString()} / ৳{target.toLocaleString()}
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-600 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {fund?.targetDate && (
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Target date: {new Date(fund.targetDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </AppShell>
  );
}
