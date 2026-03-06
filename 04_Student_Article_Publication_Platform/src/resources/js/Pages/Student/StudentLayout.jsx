import React from 'react';
import { Link } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';
import ThemePicker from '@/Components/ThemePicker';

export default function StudentLayout({ children }) {
    const { colors } = useTheme();

    // Example navigation array with settings links
    const navigation = [
        { name: 'Dashboard', href: '/student/dashboard', icon: '🏠' },
        { name: 'Settings', href: '/student/settings', icon: '⚙️' },
        { name: 'Appearance', href: '/student/settings/appearance', icon: '🎨' },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-40 border-b" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <ul className="flex space-x-6 px-8 h-16 items-center">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <Link href={item.href} className="flex items-center space-x-2 font-serif text-lg" style={{ color: colors.text }}>
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Sidebar */}
            <aside className="fixed left-0 top-16 bottom-0 w-64 border-r" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                {/* Sidebar content can go here */}
            </aside>

            {/* Main Content */}
            <main className="pl-64 pt-16">
                {children}
            </main>

            <ThemePicker position="bottom-right" />
        </div>
    );
}
