import { useTheme } from '@/Context/ThemeContext';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    const { colors } = useTheme();

    const baseStyle = {
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        color: '#FFFFFF',
        boxShadow: `0 4px 6px ${colors.shadowSoft}`,
        border: 'none',
    };

    const hoverStyle = {
        filter: 'brightness(1.1)',
        transform: 'translateY(-2px)',
        boxShadow: `0 10px 15px -3px ${colors.primary}40`,
    };

    return (
        <button
            {...props}
            style={disabled ? { ...baseStyle, opacity: 0.6, cursor: 'not-allowed' } : baseStyle}
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
            className={`inline-flex items-center rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
