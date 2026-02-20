import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

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
            className={
                'w-full px-4 py-3 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white hover:border-gray-300 ' +
                className
            }
            ref={localRef}
        />
    );
});
