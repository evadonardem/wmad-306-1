export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `taskmo-btn inline-flex items-center justify-center px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-100 dark:focus:ring-offset-gray-950 ${
                    disabled ? 'opacity-40' : 'hover:brightness-105'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
