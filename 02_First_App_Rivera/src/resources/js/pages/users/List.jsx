export default function List({ users }) {
    return (
        <>
        <div>
            <h1>Users List</h1>
            <p>This is the users list page.</p>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.first_name} {user.last_name}</li>
                ))}
            </ul>
        </div>
        </>
    );
}
