import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', mono: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || '';

  // Fetch users
  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setError('Failed to fetch users'));
  }, []);

  // Handle input change
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update user
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mono) {
      setError('All fields are required');
      return;
    }
    setError('');
    if (editingId) {
      fetch(`${API_URL}/api/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(updated => {
          setUsers(users.map(u => (u.id === editingId ? updated : u)));
          setEditingId(null);
          setForm({ name: '', email: '', mono: '' });
        })
        .catch(() => setError('Failed to update user'));
    } else {
      fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(newUser => {
          setUsers([...users, newUser]);
          setForm({ name: '', email: '', mono: '' });
        })
        .catch(() => setError('Failed to add user'));
    }
  };

  // Edit user
  const handleEdit = user => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, mono: user.mono || '' });
  };

  // Delete user
  const handleDelete = id => {
    fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => setUsers(users.filter(u => u.id !== id)))
      .catch(() => setError('Failed to delete user'));
  };

  return (
    <div className="App">
      <h1>User Management</h1>
      <form onSubmit={handleSubmit} className="user-form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="mono"
          placeholder="Mobile Number"
          value={form.mono}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} User</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', email: '', mono: '' }); }}>
            Cancel
          </button>
        )}
      </form>
      {/* Only show error if it's not the fetch users error and users are not empty */}
      {error && (error !== 'Failed to fetch users' || users.length > 0) && <div className="error">{error}</div>}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>No users exist</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.mono || ''}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
