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
                    ? 'border-green-600 bg-green-50 text-green-700 focus:border-green-700 focus:bg-green-100 focus:text-green-800'
                    : 'border-transparent text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700 focus:border-green-300 focus:bg-green-50 focus:text-green-700'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
