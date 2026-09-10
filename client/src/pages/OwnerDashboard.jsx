import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/owner/dashboard');
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div>
      <Navbar title="Store Owner Dashboard" />
      <div className="page-content">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {data && (
          <>
            <div className="stat-cards">
              <div className="stat-card">
                <span className="stat-label">Store</span>
                <span className="stat-value">{data.store.name}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Address</span>
                <span className="stat-value">{data.store.address}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Average Rating</span>
                <span className="stat-value">
                  {Number(data.avg_rating).toFixed(1)} / 5
                </span>
              </div>
            </div>

            <h3>Users who rated your store</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {data.raters.map((r) => (
                  <tr key={r.user_id}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.rating}</td>
                  </tr>
                ))}
                {data.raters.length === 0 && (
                  <tr>
                    <td colSpan="3">No ratings yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
