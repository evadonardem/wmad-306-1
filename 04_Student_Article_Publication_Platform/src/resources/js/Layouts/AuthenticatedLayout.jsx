import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen authenticated-theme" style={{ backgroundColor: colors.aged, color: colors.newsprint }}>
            <nav className="border-b" style={{ borderColor: colors.border, backgroundColor: colors.paper }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex min-h-12 items-center justify-between gap-4">
                        <div className="flex items-center">
                            <Link href="/" className="inline-flex items-center" aria-label="Go home">
                                <span
                                    className="inline-flex items-center border px-2.5 py-1.5 text-sm font-black tracking-[0.2em]"
                                    style={{
                                        borderColor: colors.newsprint,
                                        color: colors.newsprint,
                                        backgroundColor: colors.paper,
                                    }}
                                >
                                    FYI
                                </span>
                            </Link>
                        </div>

                        <div className="hidden sm:flex sm:items-center">
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center border px-3 py-1.5 text-sm font-semibold tracking-wide"
                                style={{
                                    borderColor: colors.border,
                                    color: colors.newsprint,
                                    backgroundColor: colors.paper,
                                }}
                            >
                                Dashboard
                            </Link>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                            className="inline-flex items-center justify-center border p-2 transition duration-150 ease-in-out focus:outline-none"
                            style={{ borderColor: colors.border, color: colors.byline, backgroundColor: colors.paper }}
                        >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2" style={{ borderColor: colors.border }}>
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header style={{ backgroundColor: colors.paper, borderBottom: `1px solid ${colors.border}` }}>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            <style>{`
                .authenticated-theme .bg-white { background-color: ${colors.paper} !important; }
                .authenticated-theme .bg-gray-100 { background-color: ${colors.aged} !important; }
                .authenticated-theme .border-gray-100,
                .authenticated-theme .border-gray-200,
                .authenticated-theme .border-gray-300 { border-color: ${colors.border} !important; }
                .authenticated-theme .text-gray-900,
                .authenticated-theme .text-gray-800,
                .authenticated-theme .text-gray-700 { color: ${colors.newsprint} !important; }
                .authenticated-theme .text-gray-600,
                .authenticated-theme .text-gray-500,
                .authenticated-theme .text-gray-400 { color: ${colors.byline} !important; }
                .authenticated-theme a:hover { color: ${colors.accent}; }
            `}</style>
        </div>
    );
}
