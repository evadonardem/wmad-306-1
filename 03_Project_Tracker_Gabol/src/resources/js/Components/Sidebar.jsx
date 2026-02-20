import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    Home as HomeIcon,
    Assignment as AssignmentIcon,
    Groups as GroupsIcon,
    CheckCircle as CheckCircleIcon,
    BarChart as BarChartIcon,
    Message as MessageIcon,
    CalendarToday as CalendarIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Folder as FolderIcon,
} from '@mui/icons-material';

export default function Sidebar({
    toggleSidebar,
    compact: compactProp,
    setCompact: setCompactProp,
    sidebarVisible,
    closeSidebar
}) {
    const page = usePage();
    const { url } = page;

    const sidebarRef = useRef(null);
    const previousActiveRef = useRef(null);

    /* ---------------- COMPACT STATE ---------------- */
    const [compactInternal, setCompactInternal] = useState(false);
    const compact =
        typeof compactProp !== 'undefined' ? compactProp : compactInternal;
    const setCompact =
        typeof setCompactProp === 'function'
            ? setCompactProp
            : setCompactInternal;

    /* ---------------- LOAD COMPACT ---------------- */
    useEffect(() => {
        try {
            const v = localStorage.getItem('sidebar_compact');
            if (v !== null) setCompact(v === 'true');
        } catch (e) {}
    }, []);

    /* ---------------- FOCUS TRAP ---------------- */
    useEffect(() => {
        if (!sidebarVisible) return;

        const node = sidebarRef.current;
        if (!node) return;

        previousActiveRef.current = document.activeElement;

        const focusable = Array.from(
            node.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            )
        );

        const first = focusable[0] || node;
        const last = focusable[focusable.length - 1] || node;

        first.focus();

        function handleKey(e) {
            if (e.key === 'Escape') {
                if (closeSidebar) closeSidebar();
                else if (toggleSidebar) toggleSidebar();
            }

            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (
                    !e.shiftKey &&
                    document.activeElement === last
                ) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }

        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('keydown', handleKey);
            previousActiveRef.current?.focus();
        };
    }, [sidebarVisible]);

    /* ---------------- MENU ---------------- */
    const [expandedItems, setExpandedItems] = useState({
        projects: false,
        team: false,
    });

    const toggleExpanded = (item) => {
        setExpandedItems((prev) => ({
            ...prev,
            [item]: !prev[item],
        }));
    };

    const safeRoute = (name) => {
        try {
            return route(name);
        } catch {
            return '#';
        }
    };

    const mainMenuItems = [
        {
            label: 'Dashboard',
            icon: HomeIcon,
            href: safeRoute('dashboard'),
            id: 'dashboard',
        },
        {
            label: 'Projects',
            icon: AssignmentIcon,
            href: safeRoute('projects.index'),
            id: 'projects',
            expandable: true,
        },
        {
            label: 'Team',
            icon: GroupsIcon,
            href: '#',
            id: 'team',
            expandable: true,
        },
        {
            label: 'Tasks',
            icon: CheckCircleIcon,
            href: '#',
            id: 'tasks',
        },
    ];

    const isActive = (href) => url === href;

    /* ---------------- LINK COMPONENT ---------------- */
    const SidebarLink = ({ item }) => {
        const Icon = item.icon;
        const isExpanded = expandedItems[item.id];

        return (
            <div>
                <div className="flex items-center">
                    <Link
                        href={item.href}
                        className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-gray-200 hover:bg-gray-800 transition"
                    >
                        <Icon sx={{ fontSize: '1.25rem' }} />
                        {!compact && (
                            <span className="text-sm font-medium">
                                {item.label}
                            </span>
                        )}
                    </Link>

                    {item.expandable && (
                        <button
                            onClick={() =>
                                toggleExpanded(item.id)
                            }
                            className="px-2 text-gray-400 hover:text-white"
                        >
                            {isExpanded ? (
                                <ExpandLessIcon />
                            ) : (
                                <ExpandMoreIcon />
                            )}
                        </button>
                    )}
                </div>

                {item.expandable && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1 text-sm text-gray-400">
                        <Link href="#" className="block hover:text-white">
                            All Projects
                        </Link>
                        <Link href="#" className="block hover:text-white">
                            Active Projects
                        </Link>
                        <Link href="#" className="block hover:text-white">
                            Archived
                        </Link>
                    </div>
                )}
            </div>
        );
    };

    /* ---------------- RENDER ---------------- */
    return (
        <div
            ref={sidebarRef}
            className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 z-50
            ${
                sidebarVisible
                    ? 'translate-x-0'
                    : '-translate-x-full'
            }`}
        >
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="text-white font-semibold">
                    Sidebar
                </div>

                <button
                    onClick={toggleSidebar}
                    className="text-gray-400 hover:text-white"
                >
                    ✕
                </button>
            </div>

            {/* MENU */}
            <nav className="p-3 space-y-2">
                {mainMenuItems.map((item) => (
                    <SidebarLink
                        key={item.id}
                        item={item}
                    />
                ))}
            </nav>
        </div>
    );
}

