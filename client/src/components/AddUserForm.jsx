import { useState } from 'react';
import api from '../api/axios';

export default function AddUserForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/users', form);
      setSuccess('User created successfully');
      setForm({ name: '', email: '', address: '', password: '', role: 'user' });
      onCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inline-form">
      <h4>Add User</h4>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="form-row">
        <input
          type="text"
          name="name"
          placeholder="Full name (20-60 chars)"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password (8-16, 1 upper, 1 special)"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">Normal User</option>
          <option value="owner">Store Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Create User</button>
      </div>
    </form>
  );
}
