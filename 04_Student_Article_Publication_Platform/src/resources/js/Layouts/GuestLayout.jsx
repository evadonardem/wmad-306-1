import ApplicationLogo from '@/Components/ApplicationLogo';
import { NEWSPAPER_THEMES, getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function GuestLayout({ children }) {
    const [showThemePicker, setShowThemePicker] = useState(false);
    const { theme: currentTheme, setTheme: setCurrentTheme } = useThemeContext();
    const colors = getThemeColors(currentTheme);

    return (
        <div
            className="auth-shell min-h-screen px-4 py-8 sm:px-6"
            style={{
                backgroundColor: colors.aged,
                color: colors.newsprint,
            }}
        >
            <div className="mx-auto w-full max-w-5xl">
                <div
                    className="mb-8 border-b-4 pb-5"
                    style={{ borderColor: colors.newsprint }}
                >
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-10" />
                            <div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: colors.byline }}>
                                    Student Journal
                                </div>
                                <div className="font-serif text-3xl font-black leading-none" style={{ color: colors.newsprint }}>
                                    THE FYI
                                </div>
                            </div>
                        </Link>

                        <button
                            type="button"
                            className="rounded border px-3 py-2 text-xs font-mono tracking-wider"
                            style={{ borderColor: colors.border, color: colors.newsprint, backgroundColor: colors.paper }}
                            onClick={() => setShowThemePicker((value) => !value)}
                        >
                            THEME
                        </button>
                    </div>

                    {showThemePicker && (
                        <div
                            className="mt-3 w-full rounded border p-3 sm:ml-auto sm:w-64"
                            style={{ backgroundColor: colors.paper, borderColor: colors.border }}
                        >
                            <div className="mb-2 font-serif text-sm font-bold" style={{ color: colors.newsprint }}>
                                Newspaper Themes
                            </div>
                            <div className="space-y-1">
                                {Object.entries(NEWSPAPER_THEMES).map(([key, theme]) => (
                                    (() => {
                                        const themeColors = getThemeColors(key);
                                        return (
                                    <button
                                        key={key}
                                        type="button"
                                        className="flex w-full items-center gap-2 rounded px-2 py-2 text-left"
                                        style={{
                                            backgroundColor: currentTheme === key ? `${colors.accent}22` : 'transparent',
                                            color: colors.newsprint,
                                        }}
                                        onClick={() => {
                                            setCurrentTheme(key);
                                            setShowThemePicker(false);
                                        }}
                                    >
                                        <span className="flex items-center gap-1">
                                            <span
                                                className="h-3 w-3 rounded-full border"
                                                style={{ backgroundColor: themeColors.accent, borderColor: themeColors.border }}
                                            />
                                            <span
                                                className="h-3 w-3 rounded-full border"
                                                style={{ backgroundColor: themeColors.newsprint, borderColor: themeColors.border }}
                                            />
                                            <span
                                                className="h-3 w-3 rounded-full border"
                                                style={{ backgroundColor: themeColors.paper, borderColor: themeColors.border }}
                                            />
                                        </span>
                                        <span className="font-serif text-sm">{theme.name}</span>
                                        {currentTheme === key && <span className="ml-auto text-xs font-mono">OK</span>}
                                    </button>
                                        );
                                    })()
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mx-auto w-full max-w-md">
                    <div
                        className="auth-card rounded border p-6 shadow-sm"
                        style={{
                            backgroundColor: colors.paper,
                            borderColor: colors.border,
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>

            <style>{`
                .auth-shell .text-gray-600,
                .auth-shell .text-gray-700 {
                    color: ${colors.byline} !important;
                }

                .auth-shell .text-green-600 {
                    color: #166534 !important;
                }

                .auth-shell a {
                    color: ${colors.newsprint};
                }

                .auth-shell a:hover {
                    color: ${colors.accent};
                }

                .auth-shell .auth-card input[type='text'],
                .auth-shell .auth-card input[type='email'],
                .auth-shell .auth-card input[type='password'] {
                    border-color: ${colors.border} !important;
                    background-color: ${colors.paper} !important;
                    color: ${colors.newsprint} !important;
                    border-radius: 0.375rem !important;
                }

                .auth-shell .auth-card input[type='text']:focus,
                .auth-shell .auth-card input[type='email']:focus,
                .auth-shell .auth-card input[type='password']:focus {
                    border-color: ${colors.accent} !important;
                    box-shadow: 0 0 0 2px ${colors.accent}33 !important;
                }

                .auth-shell .auth-card input[type='checkbox'] {
                    border-color: ${colors.border} !important;
                    color: ${colors.accent} !important;
                }

                .auth-shell .auth-card button.inline-flex {
                    background-color: ${colors.newsprint} !important;
                    color: ${colors.paper} !important;
                    border-color: ${colors.newsprint} !important;
                }

                .auth-shell .auth-card button.inline-flex:hover,
                .auth-shell .auth-card button.inline-flex:focus {
                    background-color: ${colors.accent} !important;
                    border-color: ${colors.accent} !important;
                }
            `}</style>
        </div>
    );
}
