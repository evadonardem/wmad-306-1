import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    if (!user) {
        return <main>{children}</main>;
    }

    const roles = auth.roles || [];
    const isAdmin = roles.includes('admin');
    const isWriter = roles.includes('writer');
    const notifications = auth.notifications;
    const showNotifications = Boolean(notifications);
    const notificationCount = isAdmin
        ? (notifications?.pendingWriterRequests || 0) +
          (notifications?.pendingArticles || 0) +
          (notifications?.approvedArticles || 0)
        : isWriter
          ? (notifications?.myPendingArticles || 0) +
            (notifications?.myRejectedArticles || 0) +
            (notifications?.myApprovedArticles || 0)
          : notifications?.latestApprovedArticles || 0;

    const formatTimestamp = (value) => {
        if (!value) {
            return 'Just now';
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return 'Just now';
        }
        return date.toLocaleString();
    };

    const renderNotificationItem = ({ title, subtitle, timestamp, badgeClass }) => (
        <div className="rounded-lg border border-slate-800/80 bg-slate-950/70 px-3 py-2">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-100">{title}</p>
                    <p className="text-xs text-slate-400">{subtitle}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${badgeClass}`}>
                    {timestamp}
                </span>
            </div>
        </div>
    );

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-8 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-24 h-52 w-52 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
            <nav className="relative z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('welcome')} className="inline-flex items-center gap-2">
                                    <ApplicationLogo className="h-8 w-8" />
                                    <span className="hidden text-sm font-semibold text-slate-100 sm:block">Campus Quill</span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('articles.index')} active={route().current('articles.*')}>
                                    Articles
                                </NavLink>
                                {isAdmin && (
                                    <NavLink href={route('admin.dashboard')} active={route().current('admin.*')}>
                                        Admin
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {showNotifications && (
                                <div className="relative me-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className="relative inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-2.5 py-2 text-slate-300 hover:text-white"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 17h5l-1.4-1.4a2 2 0 01-.6-1.4V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
                                                    />
                                                </svg>
                                                {notificationCount > 0 && (
                                                    <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                                                        {notificationCount}
                                                    </span>
                                                )}
                                            </button>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content
                                            align="right"
                                            contentClasses="py-2 bg-slate-900 border border-slate-700 notif-pop"
                                        >
                                            <div className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Notifications
                                            </div>
                                            {isAdmin && (
                                                <div className="space-y-3 px-4 pb-2 text-sm text-slate-200">
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Writer Requests ({notifications?.pendingWriterRequests || 0})
                                                        </p>
                                                        <div className="mt-2 space-y-2">
                                                            {(notifications?.pendingWriterRequestsList || []).length === 0 &&
                                                                renderNotificationItem({
                                                                    title: 'No pending writer requests',
                                                                    subtitle: 'You are all caught up.',
                                                                    timestamp: 'OK',
                                                                    badgeClass: 'bg-emerald-500/15 text-emerald-200',
                                                                })}
                                                            {(notifications?.pendingWriterRequestsList || []).map((request) =>
                                                                renderNotificationItem({
                                                                    title: request.name,
                                                                    subtitle: request.email,
                                                                    timestamp: formatTimestamp(request.writer_application_submitted_at),
                                                                    badgeClass: 'bg-amber-500/15 text-amber-200',
                                                                }),
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Pending Articles ({notifications?.pendingArticles || 0})
                                                        </p>
                                                        <div className="mt-2 space-y-2">
                                                            {(notifications?.pendingArticlesList || []).length === 0 &&
                                                                renderNotificationItem({
                                                                    title: 'No pending articles',
                                                                    subtitle: 'Awaiting submissions.',
                                                                    timestamp: 'OK',
                                                                    badgeClass: 'bg-emerald-500/15 text-emerald-200',
                                                                })}
                                                            {(notifications?.pendingArticlesList || []).map((article) =>
                                                                renderNotificationItem({
                                                                    title: article.title,
                                                                    subtitle: `by ${article.user?.name || 'Unknown author'}`,
                                                                    timestamp: formatTimestamp(article.updated_at),
                                                                    badgeClass: 'bg-amber-500/15 text-amber-200',
                                                                }),
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Recently Approved ({notifications?.approvedArticles || 0})
                                                        </p>
                                                        <div className="mt-2 space-y-2">
                                                            {(notifications?.approvedArticlesList || []).length === 0 &&
                                                                renderNotificationItem({
                                                                    title: 'No approved articles yet',
                                                                    subtitle: 'Approve a submission to see it here.',
                                                                    timestamp: 'NEW',
                                                                    badgeClass: 'bg-cyan-500/15 text-cyan-200',
                                                                })}
                                                            {(notifications?.approvedArticlesList || []).map((article) =>
                                                                renderNotificationItem({
                                                                    title: article.title,
                                                                    subtitle: `by ${article.user?.name || 'Unknown author'}`,
                                                                    timestamp: formatTimestamp(article.reviewed_at || article.updated_at),
                                                                    badgeClass: 'bg-cyan-500/15 text-cyan-200',
                                                                }),
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href={route('admin.dashboard')}
                                                        className="inline-flex text-xs font-semibold text-cyan-300"
                                                    >
                                                        Open Admin Dashboard
                                                    </Link>
                                                </div>
                                            )}

                                            {isWriter && (
                                                <div className="space-y-3 px-4 pb-2 text-sm text-slate-200">
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            My Pending ({notifications?.myPendingArticles || 0})
                                                        </p>
                                                        <div className="mt-2 space-y-2">
                                                            {(notifications?.myPendingArticlesList || []).length === 0 &&
                                                                renderNotificationItem({
                                                                    title: 'No pending submissions',
                                                                    subtitle: 'Draft your next article.',
                                                                    timestamp: 'OK',
                                                                    badgeClass: 'bg-emerald-500/15 text-emerald-200',
                                                                })}
                                                            {(notifications?.myPendingArticlesList || []).map((article) =>
                                                                renderNotificationItem({
                                                                    title: article.title,
                                                                    subtitle: 'Awaiting admin review',
                                                                    timestamp: formatTimestamp(article.updated_at),
                                                                    badgeClass: 'bg-amber-500/15 text-amber-200',
                                                                }),
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            My Approved ({notifications?.myApprovedArticles || 0})
                                                        </p>
                                                        <div className="mt-2 space-y-2">
                                                            {(notifications?.myApprovedArticlesList || []).length === 0 &&
                                                                renderNotificationItem({
                                                                    title: 'No approvals yet',
                                                                    subtitle: 'Publish a story to see it here.',
                                                                    timestamp: 'NEW',
                                                                    badgeClass: 'bg-cyan-500/15 text-cyan-200',
                                                                })}
                                                            {(notifications?.myApprovedArticlesList || []).map((article) =>
                                                                renderNotificationItem({
                                                                    title: article.title,
                                                                    subtitle: 'Approved for publishing',
                                                                    timestamp: formatTimestamp(article.reviewed_at || article.updated_at),
                                                                    badgeClass: 'bg-cyan-500/15 text-cyan-200',
                                                                }),
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            My Rejected ({notifications?.myRejectedArticles || 0})
                                                        </p>
                                                        <div className="mt-2 space-y-2">
                                                            {(notifications?.myRejectedArticlesList || []).length === 0 &&
                                                                renderNotificationItem({
                                                                    title: 'No rejections',
                                                                    subtitle: 'Keep up the great work.',
                                                                    timestamp: 'OK',
                                                                    badgeClass: 'bg-emerald-500/15 text-emerald-200',
                                                                })}
                                                            {(notifications?.myRejectedArticlesList || []).map((article) =>
                                                                renderNotificationItem({
                                                                    title: article.title,
                                                                    subtitle: 'Needs revision',
                                                                    timestamp: formatTimestamp(article.reviewed_at || article.updated_at),
                                                                    badgeClass: 'bg-rose-500/15 text-rose-200',
                                                                }),
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href={route('articles.index')}
                                                        className="inline-flex text-xs font-semibold text-cyan-300"
                                                    >
                                                        Open My Articles
                                                    </Link>
                                                </div>
                                            )}

                                            {!isAdmin && !isWriter && (
                                                <div className="space-y-3 px-4 pb-2 text-sm text-slate-200">
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Freshly Approved ({notifications?.latestApprovedArticles || 0})
                                                        </p>
                                                        <div className="mt-2 space-y-2">
                                                            {(notifications?.latestApprovedArticlesList || []).length === 0 &&
                                                                renderNotificationItem({
                                                                    title: 'No new articles yet',
                                                                    subtitle: 'Check back later.',
                                                                    timestamp: 'NEW',
                                                                    badgeClass: 'bg-cyan-500/15 text-cyan-200',
                                                                })}
                                                            {(notifications?.latestApprovedArticlesList || []).map((article) =>
                                                                renderNotificationItem({
                                                                    title: article.title,
                                                                    subtitle: `by ${article.user?.name || 'Unknown author'}`,
                                                                    timestamp: formatTimestamp(article.reviewed_at || article.updated_at),
                                                                    badgeClass: 'bg-cyan-500/15 text-cyan-200',
                                                                }),
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href={route('articles.index')}
                                                        className="inline-flex text-xs font-semibold text-cyan-300"
                                                    >
                                                        Explore Articles
                                                    </Link>
                                                </div>
                                            )}
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            )}
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium leading-4 text-slate-200 transition duration-150 ease-in-out hover:text-white focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 transition duration-150 ease-in-out hover:bg-slate-900 hover:text-white focus:bg-slate-900 focus:text-white focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('articles.index')} active={route().current('articles.*')}>
                            Articles
                        </ResponsiveNavLink>
                        {isAdmin && (
                            <ResponsiveNavLink href={route('admin.dashboard')} active={route().current('admin.*')}>
                                Admin
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-slate-800 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-slate-100">{user.name}</div>
                            <div className="text-sm font-medium text-slate-400">{user.email}</div>
                        </div>

                        {showNotifications && (
                            <div className="mt-3 border-t border-slate-800 px-4 pt-3 text-sm text-slate-200">
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Notifications
                                </p>
                                {isAdmin ? (
                                    <>
                                        <p>Pending writer requests: {notifications?.pendingWriterRequests || 0}</p>
                                        <p>Pending articles: {notifications?.pendingArticles || 0}</p>
                                        <p>Approved articles: {notifications?.approvedArticles || 0}</p>
                                    </>
                                ) : isWriter ? (
                                    <>
                                        <p>My pending articles: {notifications?.myPendingArticles || 0}</p>
                                        <p>My approved articles: {notifications?.myApprovedArticles || 0}</p>
                                        <p>My rejected articles: {notifications?.myRejectedArticles || 0}</p>
                                    </>
                                ) : (
                                    <>
                                        <p>Freshly approved: {notifications?.latestApprovedArticles || 0}</p>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-slate-800/80 bg-slate-950/70">
                    <div className="mx-auto max-w-7xl px-4 py-6 text-slate-100 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main className="relative">{children}</main>
        </div>
    );
}
