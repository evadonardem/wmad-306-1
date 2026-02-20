import { usePage } from '@inertiajs/react'

export default function List() {
    const { users = [] } = usePage().props

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User List</h1>

            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-t">
                                    <td className="px-4 py-2">{u.id}</td>
                                    <td className="px-4 py-2">{u.name}</td>
                                    <td className="px-4 py-2">{u.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}