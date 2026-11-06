'use client';

/**
 * Passthrough provider — kept so layout.js stays stable.
 * Notifications use native React hooks (no @tanstack/react-query required).
 */
export default function QueryProvider({ children }) {
  return children;
}
