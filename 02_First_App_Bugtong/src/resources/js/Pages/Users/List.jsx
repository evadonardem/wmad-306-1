import React from 'react';

export default function List({ users }) {
  return (
    <>
      <h1>Users List</h1>
      <hr />
      {users.map((user) => (
        <div key={user.id}>
          <p>
            Name: {user.first_name} {user.last_name}
            <br />
            Email: {user.email}
          </p>
          <hr />
        </div>
      ))}
    </>
  );
}
