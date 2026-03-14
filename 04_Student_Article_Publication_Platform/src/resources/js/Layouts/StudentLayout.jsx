import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import RoleFooter from '@/Components/RoleFooter';

export default function StudentLayout({ children }) {
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.aged, color: colors.newsprint }}>
            {children}
            <RoleFooter role="student" />
        </div>
    );
}
