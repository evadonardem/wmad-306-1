import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useTheme } from '@/Context/ThemeContext';

export default function GuestLayout({ children }) {
    const { colors, isDarkMode } = useTheme();

    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center pt-6 sm:pt-0"
            style={{ backgroundColor: colors.background }}
        >
            {/* Logo Section */}
            <div className="mb-6 flex justify-center">
                <Link href="/">
                    <div
                        className="h-16 w-16 rounded-lg flex items-center justify-center"
                        style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                            boxShadow: `0 10px 15px -3px ${isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                        }}
                    >
                        <span
                            className="text-2xl font-bold"
                            style={{ color: colors.surface }}
                        >
                            T
                        </span>
                    </div>
                </Link>
            </div>

            {/* Form Container with Glass Effect */}
            <div
                className="mt-6 w-full overflow-hidden px-6 py-8 sm:max-w-md sm:rounded-2xl"
                style={{
                    backgroundColor: colors.surface,
                    boxShadow: `0 20px 25px -5px ${isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                    border: `1px solid ${colors.border}`,
                }}
            >
                {children}
            </div>

            {/* Footer */}
            <div className="mt-4 text-center text-sm" style={{ color: colors.textSecondary }}>
                <span>Midnight Slate Pro • Modern Project Tracker</span>
            </div>
        </div>
    );
}
