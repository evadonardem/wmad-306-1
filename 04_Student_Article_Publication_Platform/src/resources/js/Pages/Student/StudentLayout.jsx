import React from 'react';
import { Link } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';
import ThemePicker from '@/Components/ThemePicker';

export default function StudentLayout({ children }) {
    const { colors } = useTheme();
    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            <main>
                {children}
            </main>
            <ThemePicker position="floating-bottom-right" />
        </div>
    );
}
