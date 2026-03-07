import EditorTopBar from '@/Pages/Editor/Components/EditorTopBar';
import { useTheme } from '@/Contexts/ThemeContext';

export default function EditorLayout({ children }) {
    const { colors } = useTheme();

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text }}>
            <div className="w-full px-2 pt-2 sm:px-3 lg:px-4">
                <EditorTopBar />
            </div>
            <main className="w-full px-2 pb-6 sm:px-3 lg:px-4">{children}</main>
        </div>
    );
}
