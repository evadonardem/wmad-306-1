import React from 'react';

export default function List({ users }) {
    return (
        <React.Fragment>
            <h1 className="text-2xl font-bold mb-4">Users List</h1> 
            <hr />
            <p>This is the users list page.</p>

            {users.map((user) => (
                <div key={user.id} className="mb-2 p-4 border rounded">
                    Name: <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
                    Email: <p className="text-gray-600">{user.email}</p>
                </div>
            ))}
        </React.Fragment>
    );
}