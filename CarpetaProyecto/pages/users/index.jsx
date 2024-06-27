import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Spinner } from 'components';
import { Layout } from 'components/users';
import { userService_2 } from 'services';

export default Index;

function Index() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log('Fetching users...');
        userService_2.getAll().then(data => {
            console.log('Users fetched:', data);
            setUsers(data);
        }).catch(error => {
            console.error('Error fetching users:', error);
        });
    }, []);
    function deleteUser(id) {
        setUsers(users.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        userService_2.delete(id).then(() => {
            setUsers(users => users.filter(x => x.id !== id));
        });
    }

    return (
        <Layout>
            <h1>Users</h1>
            <Link href="/users/add" className="btn btn-sm btn-success mb-2">Add User</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Identification</th>
                        <th style={{ width: '20%' }}>Name</th>
                        <th style={{ width: '20%' }}>First Last Name</th>
                        <th style={{ width: '20%' }}>Second Last Name</th>
                        <th style={{ width: '20%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {users.length ? users.map(user =>
                        <tr key={user.id}>
                            <td>{user.identification}</td>
                            <td>{user.name}</td>
                            <td>{user.first_lastName}</td>
                            <td>{user.second_lastName}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link href={`/users/edit/${user.id}`} className="btn btn-sm btn-primary me-1">Edit</Link>
                                <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" style={{ width: '60px' }} disabled={user.isDeleting}>
                                    {user.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td colSpan="5">
                                <Spinner />
                            </td>
                        </tr>
                    )}
                    {users && !users.length &&
                        <tr>
                            <td colSpan="5" className="text-center">
                                <div className="p-2">No Users To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </Layout>
    );
}
