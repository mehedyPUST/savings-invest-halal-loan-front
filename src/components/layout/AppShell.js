'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Spinner from '../ui/Spinner';
import Link from 'next/link';
import clsx from 'clsx';
import {
  LayoutDashboard,
  PiggyBank,
  HandCoins,
  Users,
  History,
  LogOut,
  Vote,
  Home,
} from 'lucide-react';

const memberLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/member/savings', label: 'My Savings', icon: PiggyBank },
  { href: '/member/loans', label: 'My Loans', icon: HandCoins },
  { href: '/member/vote', label: 'Voting', icon: Vote },
];

const managerLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/manager/savings', label: 'Savings Requests', icon: PiggyBank },
  { href: '/manager/loans', label: 'Loan Applications', icon: HandCoins },
  { href: '/manager/members', label: 'Members', icon: Users },
  { href: '/manager/fund', label: 'Fund & History', icon: History },
];

export default function AppShell({ children, requireRole }) {
  const { user, loading, logout, isManager } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const links = isManager ? managerLinks : memberLinks;

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    if (!loading && user && requireRole && user.role !== requireRole) {
      router.replace('/dashboard');
    }
  }, [user, loading, router, requireRole]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner className="h-8 w-8 text-primary-600" />
      </div>
    );
  }

  if (!user) return null;

  const activeLink = links.find(
    (l) => pathname === l.href || pathname.startsWith(l.href + '/')
  );

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-4">
      {/*
        4-grid layout:
        [1 Members] [2 Project title]
        [3 Nav]     [4 Content]
        col1 width = col3 width
        col2 width = col4 width
        row1 height matched; content row grows
      */}
      <div
        className="mx-auto max-w-[1400px] h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-2rem)] grid gap-3
          grid-cols-1
          lg:grid-cols-[240px_1fr]
          lg:grid-rows-[auto_1fr]"
      >
        {/* ===== GRID 1 — Members dashboard / user summary ===== */}
        <div className="order-1 lg:order-none rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-base shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {isManager ? 'Manager' : 'Member'} dashboard
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* ===== GRID 2 — Project title + actions ===== */}
        <div className="order-2 lg:order-none rounded-xl border border-slate-200 bg-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Cooperative Fund · Qard Hasan
            </p>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              {activeLink?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="btn-secondary text-sm inline-flex items-center gap-1.5"
            >
              <Home className="h-4 w-4" />
              Homepage
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="btn-secondary text-sm inline-flex items-center gap-1.5 text-slate-600 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        {/* ===== GRID 3 — Sidebar links ===== */}
        <div className="order-3 lg:order-none rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col min-h-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {links.map((link) => {
              const Icon = link.icon;
              const active =
                pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary-50 text-primary-800'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0 h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-slate-100">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to homepage
            </Link>
          </div>
        </div>

        {/* ===== GRID 4 — Dynamic page content ===== */}
        <div className="order-4 lg:order-none rounded-xl border border-slate-200 bg-white shadow-sm min-h-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
