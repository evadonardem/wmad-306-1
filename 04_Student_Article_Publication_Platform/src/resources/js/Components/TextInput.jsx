import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                'border-gray-300 dark:border-slate-700 eclipse:border-red-900/50 dark:bg-slate-900 eclipse:bg-rose-950/30 rounded-md shadow-sm focus:border-indigo-500 dark:focus:border-cyan-400 eclipse:focus:border-red-500 focus:ring-indigo-500 dark:focus:ring-cyan-400 eclipse:focus:ring-red-500 ' +
                // THIS LINE FIXES YOUR TEXT COLOR:
                'text-gray-900 dark:text-white eclipse:text-rose-100 ' +
                className
            }
            ref={input}
        />
    );
});
