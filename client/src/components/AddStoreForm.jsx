import { useState } from 'react';
import api from '../api/axios';

export default function AddStoreForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
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
      const payload = { ...form, owner_id: form.owner_id || undefined };
      await api.post('/admin/stores', payload);
      setSuccess('Store created successfully');
      setForm({ name: '', email: '', address: '', owner_id: '' });
      onCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inline-form">
      <h4>Add Store</h4>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="form-row">
        <input
          type="text"
          name="name"
          placeholder="Store name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Store email"
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
          type="number"
          name="owner_id"
          placeholder="Owner user ID (optional)"
          value={form.owner_id}
          onChange={handleChange}
        />
        <button type="submit">Create Store</button>
      </div>
    </form>
  );
}
