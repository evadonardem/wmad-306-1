import { Link } from '@inertiajs/react';

export default function Navbar({ title }) {
    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #e5e7eb',
            }}
        >
            <h1 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h1>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Link href={route('profile.edit')} style={{ color: '#4b5563', textDecoration: 'none' }}>
                    Profile
                </Link>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    style={{
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.75rem',
                        cursor: 'pointer',
                    }}
                >
                    Log Out
                </Link>
            </div>
        </header>
    );
}
