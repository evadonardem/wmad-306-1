export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `taskmo-btn taskmo-btn-primary inline-flex items-center justify-center px-4 py-2 text-xs font-extrabold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 ${
                    disabled ? 'opacity-40' : 'hover:brightness-110'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
