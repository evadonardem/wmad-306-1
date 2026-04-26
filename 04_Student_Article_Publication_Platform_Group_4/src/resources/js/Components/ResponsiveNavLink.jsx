import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-cyan-400 bg-slate-900/80 text-cyan-200 focus:border-cyan-300 focus:bg-slate-900 focus:text-cyan-100'
                    : 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/70 hover:text-white focus:border-slate-700 focus:bg-slate-900 focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
