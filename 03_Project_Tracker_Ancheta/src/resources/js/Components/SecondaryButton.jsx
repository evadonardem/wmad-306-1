import { useTheme } from '@/Context/ThemeContext';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    const { colors } = useTheme();

    const baseStyle = {
        backgroundColor: colors.glass,
        borderColor: colors.primary,
        color: colors.primary,
        border: `2px solid ${colors.primary}`,
    };

    const hoverStyle = {
        backgroundColor: `${colors.primary}10`,
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 6px ${colors.shadowSoft}`,
    };

    return (
        <button
            {...props}
            type={type}
            style={disabled ? { ...baseStyle, opacity: 0.5, cursor: 'not-allowed' } : baseStyle}
            onMouseEnter={(e) => {
                if (!disabled) {
                    Object.assign(e.currentTarget.style, hoverStyle);
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    Object.assign(e.currentTarget.style, baseStyle);
                }
            }}
            className={`inline-flex items-center rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
