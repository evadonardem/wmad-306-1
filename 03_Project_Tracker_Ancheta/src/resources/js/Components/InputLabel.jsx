import { useTheme } from '@/Context/ThemeContext';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    const { colors } = useTheme();

    return (
        <label
            {...props}
            style={{ color: colors.textPrimary }}
            className={`block text-sm font-semibold transition-colors duration-200 ${className}`}
        >
            {value ? value : children}
        </label>
    );
}
