import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useTheme } from '@/Context/ThemeContext';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const { colors } = useTheme();

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            style={{
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                borderColor: colors.border,
            }}
            className={`rounded-lg border-2 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                className
            }`}
            onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
            }}
            onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.boxShadow = 'none';
            }}
            ref={localRef}
        />
    );
});
