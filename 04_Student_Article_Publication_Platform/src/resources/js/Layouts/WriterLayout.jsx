import WriterTopBar from '@/Pages/Writer/Components/WriterTopBar';
import { useTheme } from '@/Contexts/ThemeContext';

export default function WriterLayout({ header, children }) {
    const { colors } = useTheme();

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text }}>
            <div className="fyi-page-shell w-full pt-3">
                <WriterTopBar />
            </div>

            {header && (
                <header className="border-b" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                    <div className="fyi-page-shell w-full py-5">{header}</div>
                </header>
            )}

            <main className="pb-6">{children}</main>
        </div>
    );
}
