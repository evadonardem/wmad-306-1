import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-indigo-400 dark:border-cyan-400 text-gray-900 dark:text-white focus:border-indigo-700'
                    : 'border-transparent text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-cyan-400 hover:text-gray-700 dark:hover:text-white focus:border-gray-300 focus:text-gray-700') +
                className
            }
        >
            {children}
        </Link>
    );
}
