'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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
import clsx from 'clsx';

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

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isManager } = useAuth();
  const links = isManager ? managerLinks : memberLinks;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo → Dashboard */}
      <Link
        href="/dashboard"
        className="flex h-16 items-center gap-2 border-b border-slate-200 px-6 hover:bg-slate-50 transition-colors"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-white font-bold text-lg">
          CF
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Cooperative Fund</p>
          <p className="text-xs text-slate-500">Qard Hasan</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname.startsWith(link.href + '/');
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
              <Icon className="h-5 w-5 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Home + User */}
      <div className="border-t border-slate-200 p-4 space-y-3">
        <Link
          href="/"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to homepage
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
