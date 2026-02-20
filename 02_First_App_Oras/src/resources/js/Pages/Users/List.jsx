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
    <div className="min-h-screen text-slate-800" style={{ background: '#fdfcf7' }}>
      <div className="relative overflow-hidden">
        {/* Subtle nature-inspired background elements */}
        <div className="absolute -top-48 right-0 h-80 w-80 rounded-full opacity-20 blur-3xl" style={{ background: 'rgba(46, 74, 46, 0.1)' }} />
        <div className="absolute -bottom-48 left-0 h-80 w-80 rounded-full opacity-15 blur-3xl" style={{ background: 'rgba(109, 76, 65, 0.1)' }} />
        <div className="absolute top-20 left-1/4 h-32 w-32 rounded-full opacity-10 blur-2xl" style={{ background: 'rgba(46, 74, 46, 0.1)' }} />
        
        {/* Organic dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(46, 74, 46, 0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-16">
          {/* Header with nature theme */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: '#6d4c41' }}>
              🌱 Community Garden
            </p>
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-black leading-tight md:text-6xl" style={{ color: '#2e4a2e', fontFamily: 'Nunito, sans-serif' }}>
                Molly Oras Community 🌿
              </h1>
              <p className="max-w-2xl text-base md:text-lg" style={{ color: '#4a5a4a', lineHeight: '1.7' }}>
                A thriving ecosystem of authentic connections. Each profile represents a unique soul 
                growing within our natural digital space, cultivated with care and intention.
              </p>
            </div>

            {/* Nature-themed badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span 
                className="rounded-full px-4 py-1.5 text-xs font-semibold border-l-4"
                style={{ 
                  background: '#e8f5e9', 
                  color: '#2e4a2e',
                  borderColor: '#6d4c41'
                }}
              >
                🌳 Growing Strong: {totalUsers} members
              </span>
              {uniqueDomains.slice(0, 4).map((domain) => (
                <span
                  key={domain}
                  className="rounded-full px-3 py-1 text-xs"
                  style={{ 
                    background: '#f4f1ea',
                    color: '#6d4c41',
                    border: '1px solid rgba(109, 76, 65, 0.2)'
                  }}
                >
                  🌸 {domain}
                </span>
              ))}
            </div>
          </div>

          {/* User cards grid with nature styling */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.length === 0 ? (
              <div 
                className="rounded-2xl p-8 text-center border-l-4"
                style={{ 
                  background: '#e8f5e9',
                  borderColor: '#6d4c41',
                  color: '#4a5a4a'
                }}
              >
                🌱 Your garden awaits its first bloom. Plant the seeds of community by adding profiles.
              </div>
            ) : (
              users.map((user) => {
                const initials = getInitials(user.first_name, user.last_name);
                const domain = (user.email || '').split('@')[1] || 'no-domain';

                // Nature-inspired gradient colors for initials
                const gradientColors = [
                  'linear-gradient(135deg, #4ade80, #22c55e)', // Green
                  'linear-gradient(135deg, #fb7185, #e11d48)', // Rose 
                  'linear-gradient(135deg, #fbbf24, #f59e0b)', // Amber
                  'linear-gradient(135deg, #60a5fa, #3b82f6)', // Blue
                  'linear-gradient(135deg, #a78bfa, #8b5cf6)', // Purple
                  'linear-gradient(135deg, #34d399, #10b981)', // Emerald
                ];
                const gradientIndex = (user.id || 0) % gradientColors.length;

                return (
                  <div
                    key={user.id}
                    className="group relative overflow-hidden rounded-2xl p-6 border-l-4 transition-all duration-300 hover:transform hover:-translate-y-1"
                    style={{ 
                      background: '#e8f5e9',
                      borderColor: '#6d4c41',
                      boxShadow: '0 4px 12px rgba(46, 74, 46, 0.08)'
                    }}
                  >
                    {/* Hover nature effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(135deg, rgba(46, 74, 46, 0.02), rgba(109, 76, 65, 0.02))'
                      }}
                    />
                    
                    <div className="relative flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        {/* Nature-themed avatar */}
                        <div 
                          className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                          style={{ background: gradientColors[gradientIndex] }}
                        >
                          {initials}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold" style={{ color: '#2e4a2e' }}>
                           {user.first_name} {user.last_name}
                          </h2>
                          <p className="text-sm" style={{ color: '#6d4c41' }}>{user.email}</p>
                        </div>
                      </div>

                      {/* Nature-themed badges */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span 
                          className="rounded-full px-2.5 py-1 border"
                          style={{ 
                            background: '#f4f1ea',
                            borderColor: 'rgba(109, 76, 65, 0.2)',
                            color: '#6d4c41'
                          }}
                        >
                          🌿 ID {user.id}
                        </span>
                        <span 
                          className="rounded-full px-2.5 py-1 border"
                          style={{ 
                            background: '#f4f1ea',
                            borderColor: 'rgba(109, 76, 65, 0.2)',
                            color: '#6d4c41'
                          }}
                        >
                          🍃 {domain}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Nature-inspired footer message */}
          <div className="mt-16 text-center">
            <p 
              className="text-sm italic px-6 py-4 rounded-lg border-l-4"
              style={{ 
                color: '#6d4c41', 
                background: '#f4f1ea',
                borderColor: '#2e4a2e'
              }}
            >
              🌱 "In every community, we find the seeds of tomorrow's growth" 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
