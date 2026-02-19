import Sidebar from '@/Components/Sidebar';
import RightSidebar from '@/Components/RightSidebar';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;

    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [sidebarCompact, setSidebarCompact] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    /* ---------------- LOAD SETTINGS ---------------- */
    useEffect(() => {
        try {
            const v = localStorage.getItem('sidebar_compact');
            if (v !== null) setSidebarCompact(v === 'true');
        } catch (e) {}

        try {
            const v2 = localStorage.getItem('sidebar_visible');
            if (v2 !== null) setSidebarVisible(v2 === 'true');
        } catch (e) {}
    }, []);

    /* ---------------- CTRL + B TOGGLE ---------------- */
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                setSidebarVisible((s) => {
                    const next = !s;
                    try {
                        localStorage.setItem(
                            'sidebar_visible',
                            String(next)
                        );
                    } catch (err) {}
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ================= NAVBAR ================= */}
            <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* LEFT */}
                    <div className="flex items-center">
                        <button
                            onClick={() => {
                                setSidebarVisible((s) => {
                                    const next = !s;
                                    try {
                                        localStorage.setItem(
                                            'sidebar_visible',
                                            String(next)
                                        );
                                    } catch (e) {}
                                    return next;
                                });
                            }}
                            className="mr-3 p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <Link
                            href="/"
                            className="text-2xl font-bold text-blue-600"
                        >
                            BizHub
                        </Link>
                    </div>

                    {/* CENTER SEARCH */}
                    <div className="hidden flex-1 mx-4 md:flex">
                        <input
                            type="text"
                            placeholder="🔍 Search..."
                            className="w-full max-w-sm bg-gray-100 rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-blue-500"
                            onFocus={() =>
                                setShowSearchDropdown(true)
                            }
                            onBlur={() =>
                                setTimeout(
                                    () =>
                                        setShowSearchDropdown(false),
                                    200
                                )
                            }
                        />
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-4">
                        <button className="text-xl">🔔</button>
                        <button className="text-xl">💬</button>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm">
                                    <div className="w-6 h-6 bg-indigo-500 text-white flex items-center justify-center rounded-full text-xs font-bold">
                                        {user.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    {user.name}
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link
                                    href={route('profile.edit')}
                                >
                                    Profile
                                </Dropdown.Link>

                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </nav>

            {/* ================= MAIN ================= */}
            <div className="flex gap-4 px-4 py-4 sm:px-6 lg:px-8">

                {/* ===== LEFT SIDEBAR (FIXED) ===== */}
                <div className="relative">

                    {/* Backdrop */}
                    {sidebarVisible && (
                        <button
                            onClick={() => {
                                setSidebarVisible(false);
                                try {
                                    localStorage.setItem(
                                        'sidebar_visible',
                                        'false'
                                    );
                                } catch (e) {}
                            }}
                            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                        />
                    )}

                    {/* Sidebar Container */}
                    <div
                        className={`fixed top-16 left-0 bottom-0 z-50 transform ${
                            sidebarVisible
                                ? 'translate-x-0'
                                : '-translate-x-full'
                        } transition-transform duration-200 ease-in-out
                        lg:static lg:translate-x-0
                        ${
                            sidebarCompact
                                ? 'w-20'
                                : 'w-64'
                        }`}
                    >
                        <Sidebar
                            toggleSidebar={() => {
                                setSidebarVisible((s) => {
                                    const next = !s;
                                    try {
                                        localStorage.setItem(
                                            'sidebar_visible',
                                            String(next)
                                        );
                                    } catch (e) {}
                                    return next;
                                });
                            }}
                            compact={sidebarCompact}
                            setCompact={setSidebarCompact}
                            sidebarVisible={sidebarVisible}
                            closeSidebar={() => {
                                setSidebarVisible(false);
                                try {
                                    localStorage.setItem(
                                        'sidebar_visible',
                                        'false'
                                    );
                                } catch (e) {}
                            }}
                        />
                    </div>
                </div>

                {/* ===== CENTER CONTENT ===== */}
                <div className="flex-1 max-w-2xl">
                    {children}
                </div>

                {/* ===== RIGHT SIDEBAR ===== */}
                <div className="hidden xl:block w-72">
                    <div className="sticky top-20">
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
