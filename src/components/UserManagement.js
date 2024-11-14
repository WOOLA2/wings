import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [editingUserId, setEditingUserId] = useState(null);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users with status: ' + response.status);
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage({ type: 'error', content: 'Failed to fetch users: ' + error.message });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingUserId
            ? `http://localhost:5000/api/users/${editingUserId}`
            : 'http://localhost:5000/api/users';
        const method = editingUserId ? 'PUT' : 'POST';

        setIsLoading(true);
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const result = await response.json();

            if (response.ok) {
                await fetchUsers();
                setMessage({ type: 'success', content: `User ${editingUserId ? 'updated' : 'added'} successfully!` });
                resetForm();
            } else {
                setMessage({ type: 'error', content: 'Failed to ' + (editingUserId ? 'update' : 'add') + ' user: ' + (result.message || 'Unknown error') });
            }
        } catch (error) {
            console.error(`Error ${editingUserId ? 'updating' : 'adding'} user:`, error);
            setMessage({ type: 'error', content: 'Error ' + (editingUserId ? 'updating' : 'adding') + ' user: ' + error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ name: '', email: '', password: '' });
        setEditingUserId(null);
    };

    const confirmDeleteUser = (id) => {
        setUserToDelete(id);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userToDelete}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                setUsers(users.filter(user => user.id !== userToDelete));
                setMessage({ type: 'success', content: 'User deleted successfully!' });
            } else {
                setMessage({ type: 'error', content: 'Failed to delete user: ' + (result.message || 'Unknown error') });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage({ type: 'error', content: 'Error deleting user: ' + error.message });
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setUserToDelete(null);
        }
    };

    const handleEdit = (user) => {
        setEditingUserId(user.id);
        setForm(user);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>User Management</h2>

            {/* Navigation links */}
            <div style={styles.linkContainer}>
                <Link to="/components/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/components/productmanagement" style={styles.link}>Product Management</Link>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="User Name"
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                    style={styles.input}
                />
                <button type="submit" disabled={isLoading} style={styles.submitButton}>
                    {isLoading ? 'Processing...' : (editingUserId ? 'Update User' : 'Add User')}
                </button>
            </form>

            {message.content && (
                <p style={{ color: message.type === 'success' ? 'green' : 'red' }}>{message.content}</p>
            )}

            <h3 style={styles.userListHeading}>User List</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>User Name</th>
                        <th style={styles.tableHeader}>Email</th>
                        <th style={styles.tableHeader}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td style={styles.tableCell}>{user.name}</td>
                            <td style={styles.tableCell}>{user.email}</td>
                            <td style={styles.tableCell}>
                                <button onClick={() => handleEdit(user)} style={styles.editButton}>Edit</button>
                                <button onClick={() => confirmDeleteUser(user.id)} style={styles.deleteButton}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Confirmation Modal for User Deletion */}
            {isModalOpen && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>Confirmation</h2>
                        <p>Are you sure you want to delete this user?</p>
                        <div style={styles.buttonContainer}>
                            <button onClick={handleDelete} style={styles.confirmButton}>Yes</button>
                            <button onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    linkContainer: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    link: {
        margin: "0 15px",
        padding: "12px 30px",
        color: "#fff",
        backgroundColor: "#008cba",
        borderRadius: "5px",
        textDecoration: "none",
        fontWeight: "bold",
        transition: "background-color 0.3s",
    },
    linkHover: {
        color: '#0056b3',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    input: {
        padding: '10px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        fontSize: '16px',
    },
    submitButton: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
    userListHeading: {
        marginTop: '20px',
        textAlign: 'center',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    tableHeader: {
        backgroundColor: '#f1f1f1',
        padding: '10px',
        borderBottom: '2px solid #ccc',
        textAlign: 'left',
    },
    tableCell: {
        padding: '10px',
        borderBottom: '1px solid #ccc',
    },
    editButton: {
        marginRight: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
    },
    modalTitle: {
        marginBottom: '10px',
    },
    buttonContainer: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-around',
    },
    confirmButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
    },
};

export default UserManagement;