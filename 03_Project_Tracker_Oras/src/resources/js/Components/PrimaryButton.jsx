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
                `inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:bg-green-800 disabled:opacity-50 ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
            style={{
                backgroundColor: disabled ? undefined : '#2e7d32',
            }}
            onMouseEnter={(e) => { if (!disabled) e.target.style.backgroundColor = '#1b5e20'; }}
            onMouseLeave={(e) => { if (!disabled) e.target.style.backgroundColor = '#2e7d32'; }}
        >
            {children}
        </button>
    );
}
