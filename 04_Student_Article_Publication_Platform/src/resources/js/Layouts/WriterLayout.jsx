import WriterTopBar from '@/Pages/Writer/Components/WriterTopBar';
import { useTheme } from '@/Contexts/ThemeContext';

export default function WriterLayout({ header, children }) {
    const { colors } = useTheme();

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text }}>
            <div className="w-full px-2 pt-2 sm:px-3 lg:px-4">
                <WriterTopBar />
            </div>

            {header && (
                <header className="border-b" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                    <div className="w-full px-2 py-4 sm:px-3 lg:px-4">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
