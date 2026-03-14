import { Link } from '@inertiajs/react';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';

function footerColumns(role) {
    if (role === 'editor') {
        return [
            {
                title: 'Editorial Desk',
                links: [
                    { label: 'Review Queue', href: '/editor/dashboard' },
                    { label: 'Tracking', href: '/editor/tracking' },
                    { label: 'Published', href: '/editor/published' },
                ],
            },
            {
                title: 'Operations',
                links: [
                    { label: 'Editorial Logs', href: '/admin/editorial-logs' },
                    { label: 'Profile Settings', href: '/profile' },
                ],
            },
            {
                title: 'Platform',
                links: [
                    { label: 'View Public Articles', href: '/articles' },
                    { label: 'Landing Page', href: '/' },
                ],
            },
            {
                title: 'Contact',
                text: ['Campus Editorial Office', '(555) 123-4567', 'editor@fyi.edu'],
            },
        ];
    }

    if (role === 'writer') {
        return [
            {
                title: 'Writer Desk',
                links: [
                    { label: 'Dashboard', href: '/writer/dashboard' },
                    { label: 'Create Article', href: '/writer/articles/create' },
                ],
            },
            {
                title: 'Workflow',
                links: [
                    { label: 'View Published Articles', href: '/articles' },
                    { label: 'Profile Settings', href: '/profile' },
                ],
            },
            {
                title: 'Resources',
                links: [
                    { label: 'Submission Guide', href: '/writer/dashboard' },
                    { label: 'Editorial Policy', href: '/writer/dashboard' },
                ],
            },
            {
                title: 'Contact',
                text: ['Writers Support Desk', '(555) 123-4567', 'writers@fyi.edu'],
            },
        ];
    }

    return [
        {
            title: 'Student Hub',
            links: [
                { label: 'Dashboard', href: '/student/dashboard' },
                { label: 'Browse Articles', href: '/articles' },
                { label: 'Profile Settings', href: '/profile' },
            ],
        },
        {
            title: 'Contribute',
            links: [
                { label: 'Become a Writer', href: '/student/writer-application', emphasis: true },
                { label: 'Community Guidelines', href: '/student/dashboard' },
            ],
        },
        {
            title: 'Explore',
            links: [
                { label: 'Landing Page', href: '/' },
                { label: 'Latest Edition', href: '/articles' },
            ],
        },
        {
            title: 'Contact',
            text: ['Student Desk', '(555) 123-4567', 'students@fyi.edu'],
        },
    ];
}

export default function RoleFooter({ role = 'student' }) {
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);
    const columns = footerColumns(role);

    return (
        <footer
            className="border-t-4 py-14"
            style={{ backgroundColor: colors.paper, borderColor: colors.newsprint }}
        >
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-10 text-center">
                    <div
                        className="font-serif text-6xl font-black tracking-[-0.05em]"
                        style={{ color: colors.newsprint }}
                    >
                        THE FYI
                    </div>
                    <div className="font-mono text-xs tracking-[0.5em]" style={{ color: colors.byline }}>
                        {role.toUpperCase()} EDITION • {theme.toUpperCase()} THEME
                    </div>
                    <div className="mx-auto my-4 h-px w-24" style={{ backgroundColor: colors.border }} />
                    <p className="font-serif text-sm italic" style={{ color: colors.byline }}>
                        "All the news that's fit to print, by students, for students."
                    </p>
                </div>

                <div className="grid gap-8 font-serif text-sm md:grid-cols-4">
                    {columns.map((column) => (
                        <div key={column.title}>
                            <h4
                                className="mb-4 font-mono text-xs font-bold uppercase tracking-wider"
                                style={{ color: colors.newsprint }}
                            >
                                {column.title}
                            </h4>
                            <ul className="space-y-2">
                                {column.links?.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="transition hover:opacity-70"
                                            style={{
                                                color: item.emphasis ? colors.newsprint : colors.byline,
                                                fontWeight: item.emphasis ? 700 : 400,
                                            }}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                                {column.text?.map((line) => (
                                    <li key={line} style={{ color: colors.byline }}>
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 border-t pt-6" style={{ borderColor: colors.border }}>
                    <p className="text-center font-mono text-xs" style={{ color: colors.border }}>
                        © {new Date().getFullYear()} THE FYI STUDENT JOURNAL. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>
        </footer>
    );
}
