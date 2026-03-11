import ApplicationLogo from '@/Components/ApplicationLogo'
import { Link, usePage, router } from '@inertiajs/react'
import { useState } from 'react'

export default function AuthenticatedLayout({ header, children }) {

const page = usePage()
const { auth } = page.props
const user = auth.user
const component = page.component

// Dark mode removed — always use the light theme and consistent button colors.

// Determine the current “active” role from the current Inertia page/component.
// This allows multi-role demo accounts to see role-specific nav + notifications.
// Try to match the component first (e.g., "Editor/Dashboard") but fall back to
// the first role the user has if the component cannot be determined.
const inferredRole = component?.toLowerCase() || ''

const role = inferredRole.includes('writer')
    ? 'writer'
    : inferredRole.includes('editor')
    ? 'editor'
    : inferredRole.includes('student')
    ? 'student'
    : user.roles?.[0]?.name

const availableRoles = (user.roles || []).map((r) => r.name)

const dashboardLinks = []

if (availableRoles.includes('writer')) {
    dashboardLinks.push({
        role: 'writer',
        label: 'Writer Dashboard',
        route: 'writer.dashboard',
    })
}

if (availableRoles.includes('editor')) {
    dashboardLinks.push({
        role: 'editor',
        label: 'Editor Dashboard',
        route: 'editor.dashboard',
    })
}

if (availableRoles.includes('student')) {
    dashboardLinks.push({
        role: 'student',
        label: 'Student Dashboard',
        route: 'student.dashboard',
    })
}

const allNotifications = user.unread_notifications || []
const notifications = allNotifications.filter((notification) => {
    const type = notification.data?.type

    if (role === 'editor') {
        return type === 'article_submitted'
    }

    if (role === 'writer') {
        return ['comment_posted', 'article_published', 'revision_requested'].includes(type)
    }

    if (role === 'student') {
        return type === 'article_published_broadcast'
    }

    return true
})

const [open, setOpen] = useState(false)

const markAsRead = (id, url) => {

    router.post(route('notifications.read', id), {}, {
        preserveScroll: true,
        onSuccess: () => {
            if (url) window.location.href = url
        }
    })

}

return (

    <div className={`min-h-screen bg-[#F8F6F1]`}>

        {/* NAVBAR */}

        <nav className={`border-b border-gray-200 bg-white`}>

            <div className="max-w-7xl mx-auto px-12 py-6 flex justify-between items-center">

                {/* LEFT SIDE */}

                <Link
                    href="/"
                    className="flex items-center gap-4"
                >
                    <ApplicationLogo className="h-8" />
                </Link>

                {/* RIGHT SIDE */}

                <div className="flex items-center gap-6 text-sm relative">

                    {dashboardLinks.map((link) => (
                        <Link
                            key={link.role}
                            href={route(link.route)}
                            className={`hover:text-[#C6A75E] ${link.role === role ? 'font-semibold' : ''} text-gray-800`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* NOTIFICATION BELL */}

                    <div className="relative">

                        <button
                            onClick={() => setOpen(!open)}
                            className="relative hover:text-[#C6A75E]"
                        >
                            🔔

                            {notifications.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {notifications.length}
                                </span>
                            )}

                        </button>

                        {open && (

                            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">

                                <div className="p-4 border-b text-sm font-semibold">
                                    Notifications
                                </div>

                                {notifications.length === 0 && (

                                    <div className="p-4 text-sm text-gray-500">
                                        No new notifications
                                    </div>

                                )}

                                {notifications.map(notification => (

                                    <div
                                        key={notification.id}
                                        className="p-4 border-b text-sm hover:bg-gray-50 cursor-pointer"
                                        onClick={() => markAsRead(notification.id, notification.data.url)}
                                    >

                                        {notification.data.message}

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                    { /* Theme toggle removed per user request */ }

                    <Link
                        href={route('profile.edit')}
                        className="hover:text-[#C6A75E]"
                    >
                        Profile
                    </Link>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="hover:text-red-500"
                    >
                        Logout
                    </Link>

                </div>

            </div>

        </nav>

        {/* PAGE HEADER */}

        {header && (

                    <header className="max-w-7xl mx-auto px-12 py-10">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center text-gray-900 dark:text-gray-200">
                                { /* Hide back button on root / welcome pages */ }
                                {(!(page.url === '/' || (component || '').toLowerCase().includes('welcome'))) && (
                                    <button
                                        onClick={() => window.history.back()}
                                        className="mr-4 text-sm px-3 py-1 rounded bg-transparent hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                                        aria-label="Go back"
                                    >
                                        ← Back
                                    </button>
                                )}

                                {header}
                            </div>

                        </div>

                    </header>

        )}

        {/* PAGE CONTENT */}

        <main>
            {children}
        </main>

    </div>

)

}
