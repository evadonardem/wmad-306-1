import * as React from 'react';

export function GoogleIcon(props) {
  return (
    <svg width={24} height={24} {...props} viewBox="0 0 24 24">
      <g fill="none" fillRule="evenodd">
        <path fill="#4285F4" d="M21.805 10.023h-9.18v3.955h5.262c-.227 1.2-1.37 3.52-5.262 3.52-3.168 0-5.75-2.62-5.75-5.84s2.582-5.84 5.75-5.84c1.8 0 3.01.72 3.7 1.34l2.53-2.46C17.09 3.7 15.13 2.7 12.625 2.7c-5.02 0-9.1 4.08-9.1 9.1s4.08 9.1 9.1 9.1c5.24 0 8.7-3.68 8.7-8.88 0-.6-.07-1.06-.16-1.5z"/>
        <path fill="#34A853" d="M3.545 7.68l3.25 2.38c.7-1.34 1.8-2.34 3.13-2.34.95 0 1.62.38 2 .7l2.44-2.38C13.97 4.7 13.02 4.3 12.625 4.3c-2.13 0-3.93 1.36-4.83 3.38z"/>
        <path fill="#FBBC05" d="M12.625 21.1c2.5 0 4.6-.82 6.13-2.24l-2.82-2.31c-.77.54-1.8.92-3.31.92-2.54 0-4.7-1.7-5.47-4.01l-3.25 2.5c1.36 2.7 4.23 4.14 8.7 4.14z"/>
        <path fill="#EA4335" d="M21.805 10.023h-9.18v3.955h5.262c-.227 1.2-1.37 3.52-5.262 3.52-3.168 0-5.75-2.62-5.75-5.84s2.582-5.84 5.75-5.84c1.8 0 3.01.72 3.7 1.34l2.53-2.46C17.09 3.7 15.13 2.7 12.625 2.7c-5.02 0-9.1 4.08-9.1 9.1s4.08 9.1 9.1 9.1c5.24 0 8.7-3.68 8.7-8.88 0-.6-.07-1.06-.16-1.5z"/>
      </g>
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg width={24} height={24} {...props} viewBox="0 0 24 24">
      <g fill="none" fillRule="evenodd">
        <circle fill="#3B5998" cx={12} cy={12} r={12} />
        <path d="M15.36 12.5h-2.02v6.5h-2.7v-6.5H8V10.3h2.64V8.8c0-2.1 1.28-3.3 3.22-3.3.92 0 1.7.07 1.93.1v2.24h-1.32c-.8 0-.96.38-.96.94v1.52h2.6l-.34 2.2z" fill="#FFF" />
      </g>
    </svg>
  );
}

export function SitemarkIcon(props) {
  return (
    <svg width={40} height={40} {...props} viewBox="0 0 40 40">
      <circle cx={20} cy={20} r={20} fill="#1976d2" />
      <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="18" fontFamily="Arial" dy=".3em">S</text>
    </svg>
  );
}
