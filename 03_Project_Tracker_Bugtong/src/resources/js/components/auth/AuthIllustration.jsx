import React from 'react';

/**
 * Abstract SVG illustration for auth pages.
 */
const AuthIllustration = () => (
  <svg
    width="340"
    height="320"
    viewBox="0 0 340 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ maxWidth: '100%', height: 'auto', marginBottom: 32 }}
  >
    <defs>
      <linearGradient id="auth-gradient" x1="0" y1="0" x2="340" y2="320" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6E2F7A" />
        <stop offset="1" stopColor="#00AFA0" />
      </linearGradient>
    </defs>
    {/* Main geometric motif */}
    <rect x="40" y="40" width="260" height="180" rx="32" fill="url(#auth-gradient)" opacity="0.18" />
    <circle cx="170" cy="130" r="70" fill="url(#auth-gradient)" opacity="0.13" />
    {/* Accent lines */}
    <path d="M60 260 Q170 200 280 260" stroke="#FFB000" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    <circle cx="60" cy="260" r="6" fill="#FFB000" />
    <circle cx="280" cy="260" r="6" fill="#FFB000" />
    {/* Dots */}
    <circle cx="90" cy="70" r="3" fill="#FFB000" />
    <circle cx="250" cy="90" r="3" fill="#FFB000" />
    <circle cx="120" cy="200" r="2" fill="#FFB000" />
    <circle cx="220" cy="180" r="2" fill="#FFB000" />
    {/* Subtle motif */}
    <rect x="110" y="60" width="120" height="40" rx="10" fill="#fff" opacity="0.07" />
    <rect x="130" y="170" width="80" height="24" rx="8" fill="#fff" opacity="0.07" />
  </svg>
);

export default AuthIllustration;
