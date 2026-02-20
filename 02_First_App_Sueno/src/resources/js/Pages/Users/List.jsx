import React from 'react';

const getInitials = (first, last) => {
  const safeFirst = (first || '').trim();
  const safeLast = (last || '').trim();
  const initials = `${safeFirst.charAt(0)}${safeLast.charAt(0)}`.toUpperCase();
  return initials || 'U';
};

export default function List({ users = [] }) {
  const totalUsers = users.length;
  const domains = users
    .map((user) => (user.email || '').split('@')[1])
    .filter(Boolean);
  const uniqueDomains = Array.from(new Set(domains));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute -top-48 right-0 h-80 w-80 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute -bottom-48 left-0 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.18) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              User Directory
            </p>
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
                Sueno&apos;s User Atlas
              </h1>
              <p className="max-w-2xl text-base text-slate-300 md:text-lg">
                A polished, story-driven snapshot of everyone in your app. Clean typography, soft glow,
                and cards that feel like collectible profiles.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-slate-700/70 bg-slate-900/80 px-4 py-1.5 text-xs font-semibold text-slate-200">
                Total Users: {totalUsers}
              </span>
              {uniqueDomains.slice(0, 4).map((domain) => (
                <span
                  key={domain}
                  className="rounded-full border border-slate-700/50 bg-slate-900/60 px-3 py-1 text-xs text-slate-300"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.length === 0 ? (
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-8 text-center text-slate-300">
                No users yet. Add your first profile to bring this page to life.
              </div>
            ) : (
              users.map((user) => {
                const initials = getInitials(user.first_name, user.last_name);
                const domain = (user.email || '').split('@')[1] || 'no-domain';

                return (
                  <div
                    key={user.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.6)]"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/10 via-transparent to-emerald-400/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                    <div className="relative flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 text-sm font-bold text-slate-900">
                          {initials}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-white">
                            {user.first_name} {user.last_name}
                          </h2>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                        <span className="rounded-full border border-slate-700/60 bg-slate-800/80 px-2.5 py-1">
                          ID {user.id}
                        </span>
                        <span className="rounded-full border border-slate-700/60 bg-slate-800/80 px-2.5 py-1">
                          {domain}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
