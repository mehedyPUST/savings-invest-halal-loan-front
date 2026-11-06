'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export default function RulesPage() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar — same links as landing page */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-white font-bold text-lg">
              CF
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">Cooperative Fund</p>
              <p className="text-xs text-slate-500">Qard Hasan</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/#features"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
            >
              How it works
            </Link>
            <Link
              href="/#benefits"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
            >
              Benefits
            </Link>
            <span className="px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg">
              Rules
            </span>
            {user && (
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition inline-flex items-center gap-1.5"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {!loading &&
              (user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-slate-600 max-w-[140px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="btn-secondary text-sm inline-flex items-center gap-1.5"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn-primary text-sm">
                  Sign in
                </Link>
              ))}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            <Link
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              How it works
            </Link>
            <Link
              href="/#benefits"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Benefits
            </Link>
            <span className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary-700 bg-primary-50">
              Rules
            </span>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-700 hover:bg-primary-50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary-700 hover:bg-primary-50"
              >
                Sign in
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="flex items-start gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Cooperative Rules — Qard Hasan
              </h1>
              <p className="text-slate-500 mt-1">Interest-free (Riba-free) by design. Principal only.</p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <section className="card p-6">
              <h2 className="font-semibold text-lg text-primary-800 mb-3">1. What is Qard Hasan?</h2>
              <p className="text-slate-700 text-sm leading-relaxed">
                A benevolent loan where the borrower repays <strong>exactly the principal</strong>{' '}
                received. No interest, no percentage fee linked to amount or time, no late penalty.
                Any stipulated extra benefit for the lender is Riba and is forbidden in this system.
              </p>
            </section>

            <section className="card p-6">
              <h2 className="font-semibold text-lg text-primary-800 mb-3">2. Savings</h2>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                <li>Members contribute a selected monthly amount to the central fund.</li>
                <li>No interest is paid on savings during the collecting phase.</li>
                <li>
                  After target is reached, the group may vote to invest surplus in Shariah-compliant
                  ways only.
                </li>
              </ul>
            </section>

            <section className="card p-6">
              <h2 className="font-semibold text-lg text-primary-800 mb-3">3. Loan Rules</h2>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                <li>
                  Maximum <strong>3 loans per member per calendar year</strong>.
                </li>
                <li>No active or overdue loan allowed when applying.</li>
                <li>
                  Loan amount cannot exceed <strong>3× the member&apos;s total contributions</strong>.
                </li>
                <li>Fund must have sufficient liquid balance.</li>
                <li>
                  Approval requires <strong>≥67% yes</strong> from active members (voting).
                </li>
                <li>
                  Repayment = principal only. Installments split the principal; they never add extra.
                </li>
                <li>
                  Hardship: manager may extend time or partially forgive (hibah) — never charge a
                  penalty.
                </li>
              </ul>
            </section>

            <section className="card p-6">
              <h2 className="font-semibold text-lg text-primary-800 mb-3">4. What is never allowed</h2>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                <li>Interest rate of any kind</li>
                <li>Service charge calculated as % of loan amount or duration</li>
                <li>Late payment fines</li>
                <li>Guaranteed fixed return on member savings</li>
                <li>Inflation indexing of the loan principal</li>
              </ul>
            </section>

            <section className="card p-6">
              <h2 className="font-semibold text-lg text-primary-800 mb-3">5. Governance</h2>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                <li>Manager starts voting; all members are notified by email.</li>
                <li>Every change to fund balance requires an extra fund-action password.</li>
                <li>
                  Full history of savings confirmations, disbursements and repayments is kept.
                </li>
                <li>When a loan is repaid, money returns to the central fund (revolving).</li>
              </ul>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="btn-secondary">
              Back to home
            </Link>
            {user ? (
              <Link href="/dashboard" className="btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/login" className="btn-primary">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Cooperative Fund. All rights reserved.</p>
            <p>Interest-free · Transparent · Member-owned</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
