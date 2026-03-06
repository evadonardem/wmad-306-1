import { Link, usePage } from '@inertiajs/react';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';

export default function WriterLayout({ children }) {
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);
    const user = usePage().props?.auth?.user;
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'W';

    return (
        <div className="writer-theme min-h-screen" style={{ backgroundColor: colors.aged, color: colors.newsprint }}>
            <div
                className="sticky top-0 z-40 border-b px-4 py-3 sm:px-6"
                style={{ backgroundColor: colors.paper, borderColor: colors.border }}
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
                    <Link
                        href={route('writer.dashboard')}
                        className="font-serif text-lg font-black tracking-tight"
                        style={{ color: colors.newsprint }}
                    >
                        Writer Desk
                    </Link>

                    <div className="flex items-center gap-2">
                        <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                            style={{ backgroundColor: colors.accent, color: colors.paper }}
                        >
                            {initial}
                        </div>

                        <Link
                            href={route('profile.edit')}
                            className="rounded border px-3 py-1.5 text-sm font-medium transition"
                            style={{ borderColor: colors.border, color: colors.newsprint, backgroundColor: colors.paper }}
                        >
                            Profile
                        </Link>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="rounded border px-3 py-1.5 text-sm font-medium transition"
                            style={{ borderColor: colors.newsprint, color: colors.paper, backgroundColor: colors.newsprint }}
                        >
                            Sign Out
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
                {children}
            </div>

            <style>{`
                .writer-theme .bg-white { background-color: ${colors.paper} !important; }
                .writer-theme .bg-gray-50 { background-color: ${colors.aged} !important; }
                .writer-theme .border-gray-100,
                .writer-theme .border-gray-200,
                .writer-theme .border-gray-300 { border-color: ${colors.border} !important; }
                .writer-theme .text-gray-900 { color: ${colors.newsprint} !important; }
                .writer-theme .text-gray-800,
                .writer-theme .text-gray-700,
                .writer-theme .text-gray-600,
                .writer-theme .text-gray-500 { color: ${colors.byline} !important; }
                .writer-theme input,
                .writer-theme select,
                .writer-theme textarea,
                .writer-theme button { color: ${colors.newsprint}; }
            `}</style>
        </div>
    );
}
