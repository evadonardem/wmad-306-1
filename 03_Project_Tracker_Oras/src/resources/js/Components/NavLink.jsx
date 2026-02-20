import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-green-600 text-green-700 focus:border-green-700 '
                    : 'border-transparent text-gray-600 hover:border-green-400 hover:text-green-600 focus:border-green-400 focus:text-green-600 ') +
                className
            }
        >
            {children}
        </Link>
    );
}
