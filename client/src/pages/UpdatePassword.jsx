import { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.put('/auth/update-password', { oldPassword, newPassword });
      setSuccess('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div>
      <Navbar title="Update Password" />
      <div className="page-content">
        <form onSubmit={handleSubmit} className="auth-form" style={{ margin: '0 auto' }}>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <input
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password (8-16, 1 upper, 1 special)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
}
