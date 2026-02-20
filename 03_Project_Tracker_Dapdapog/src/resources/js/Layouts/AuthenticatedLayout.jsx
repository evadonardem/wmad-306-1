import { Link } from '@inertiajs/react';

export default function AuthenticatedLayout({ children, header }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold mb-4">Project Tracker</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                href={route('dashboard')}
                className="block text-gray-700 hover:text-red-600"
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/projects"
                className="block text-gray-700 hover:text-red-600"
              >
                Projects
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/projects"
                className="block text-gray-700 hover:text-red-600"
              >
                Tasks
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{header || 'Dashboard'}</h1>
          <div className="flex items-center space-x-4">
            <Link
              href={route('profile.edit')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Profile
            </Link>
            <form method="POST" action={route('logout')}>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </form>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
