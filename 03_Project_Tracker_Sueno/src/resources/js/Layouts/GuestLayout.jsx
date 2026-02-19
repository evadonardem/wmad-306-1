import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';
import { useTheme } from '@/Context/ThemeContext';
import { Box, Typography } from '@mui/material';

export default function GuestLayout({ children }) {
    const { theme } = useTheme();

    return (
        <div
            className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0"
            style={{ background: `linear-gradient(135deg, ${theme.bg.primary} 0%, ${theme.bg.primary} 100%)` }}
        >
            <ThemeToggle />

            <div style={{
                padding: '16px',
                borderRadius: '50%',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '2px solid rgba(6, 182, 212, 0.5)',
                boxShadow: '0 2px 12px rgba(212, 175, 55, 0.15)',
            }}>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-800" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden px-6 py-4 sm:max-w-md"
                style={{ backgroundColor: 'transparent' }}
            >
                {children}
            </div>

            {/* Footer */}
            <Box sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(4px)',
                padding: '1rem',
                textAlign: 'center',
                borderTop: `1px solid ${theme.border}`,
            }}>
                <Typography sx={{
                    fontSize: '0.8rem',
                    color: theme.text.secondary,
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                }}>
                    © 2026 DSueno. All rights reserved.
                </Typography>
            </Box>
        </div>
    );
}
