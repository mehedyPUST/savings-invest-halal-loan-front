'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  PiggyBank,
  HandCoins,
  ShieldCheck,
  Vote,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Users,
  Lock,
  BarChart3,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ========== NAVBAR ========== */}
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

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#features"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
            >
              How it works
            </a>
            <a
              href="#benefits"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
            >
              Benefits
            </a>
            <Link
              href="/rules"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
            >
              Rules
            </Link>
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
            {!loading && (
              user ? (
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
              )
            )}
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              How it works
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Benefits
            </a>
            <Link
              href="/rules"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Rules
            </Link>
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

      {/* ========== BANNER / HERO ========== */}
      <section className="relative w-full overflow-hidden aspect-[16/9] min-h-[260px] max-h-[min(85vh,720px)]">
        {/* Full banner image — container matches 16:9 so the whole image is visible */}
        <img
          src="/banner.png"
          alt="Qard Hasan Banking — an interest-free alternative"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/85 via-primary-900/65 to-primary-800/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-primary-900/25" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 sm:px-6 pb-10 sm:pb-14 lg:pb-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Interest-free · Transparent · Member-owned
            </span>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
              Savings &amp; Qard Hasan loans, managed together
            </h1>
            <p className="mt-5 text-base sm:text-lg text-primary-50/95 leading-relaxed max-w-xl">
              A modern cooperative platform for monthly contributions, a shared central fund,
              and interest-free loans decided by member voting. Built for trust and clarity.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary-800 shadow-md hover:bg-primary-50 transition"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary-800 shadow-md hover:bg-primary-50 transition"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition"
              >
                Explore features
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Everything in one place</h2>
          <p className="mt-3 text-slate-500">
            From contributions to voting — a clear operational view for managers and members.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={PiggyBank}
            title="Monthly Savings"
            description="Members submit placements into the central fund. Managers confirm and track progress toward targets."
            color="bg-emerald-50 text-emerald-700"
          />
          <FeatureCard
            icon={HandCoins}
            title="Qard Hasan Loans"
            description="Interest-free loans with clear eligibility. Applications go through member voting before disbursement."
            color="bg-amber-50 text-amber-700"
          />
          <FeatureCard
            icon={Vote}
            title="Member Voting"
            description="Transparent ballots for loan decisions. Every member can participate and see outcomes."
            color="bg-sky-50 text-sky-700"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Fund Overview"
            description="Live balance, total saved, total loaned, and progress against the cooperative’s target."
            color="bg-primary-50 text-primary-700"
          />
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How it works</h2>
            <p className="mt-3 text-slate-500">Three simple steps from contribution to shared benefit.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Contribute',
                text: 'Members set a monthly amount and submit saving requests. The fund grows transparently for everyone.',
                icon: PiggyBank,
              },
              {
                step: '02',
                title: 'Apply & Vote',
                text: 'Eligible members apply for Qard Hasan. The community votes; managers finalize after approval.',
                icon: Vote,
              },
              {
                step: '03',
                title: 'Repay & Share',
                text: 'Repayments return to the central fund so more members can benefit over time.',
                icon: HandCoins,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl border border-slate-100 bg-slate-50/50 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-bold text-primary-200">{item.step}</span>
                  <item.icon className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BENEFITS / TRUST ========== */}
      <section id="benefits" className="scroll-mt-20 mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Built for cooperatives</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Designed around Sharia-compliant Qard Hasan principles: no interest, clear limits,
                and collective decision-making.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Central fund with full audit history',
                  'Role-based access for managers and members',
                  'Pending queues for savings and loans',
                  'Voting workflow for loan applications',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatMini icon={Lock} label="Interest rate" value="0%" sub="Qard Hasan" />
              <StatMini icon={BarChart3} label="Max loans / year" value="3" sub="Per member" />
              <StatMini icon={Users} label="Roles" value="2" sub="Manager · Member" />
              <StatMini icon={ShieldCheck} label="Transparency" value="Full" sub="History & votes" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="bg-primary-800 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">
            {user ? 'Continue to your dashboard' : 'Ready to manage your cooperative fund?'}
          </h2>
          <p className="mt-2 text-primary-100 max-w-lg mx-auto">
            {user
              ? 'View fund status, submit savings, manage loans, or vote on applications.'
              : 'Sign in to view the dashboard, submit savings, or review applications.'}
          </p>
          <Link
            href={user ? '/dashboard' : '/login'}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-800 hover:bg-primary-50 transition shadow-sm"
          >
            {user ? 'Open Dashboard' : 'Sign in to the app'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-white font-bold text-lg">
                  CF
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Cooperative Fund</p>
                  <p className="text-xs text-slate-500">Qard Hasan Management</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-xs">
                Transparent savings and interest-free loans for your cooperative community.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Product
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#features" className="hover:text-slate-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-slate-900">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="hover:text-slate-900">
                    Benefits
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Resources
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/rules" className="hover:text-slate-900">
                    Qard Hasan Rules
                  </Link>
                </li>
                {user ? (
                  <li>
                    <Link href="/dashboard" className="hover:text-slate-900">
                      Dashboard
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link href="/login" className="hover:text-slate-900">
                      Sign in
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Principles
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Interest-free</li>
                <li>Transparent</li>
                <li>Member-owned</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-100 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Cooperative Fund. All rights reserved.</p>
            <p>Interest-free · Transparent · Member-owned</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow h-full">
      <div className={`inline-flex rounded-lg p-2.5 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatMini({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-700">{label}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}
