import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null); // tracks which store's rating is being submitted

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/stores', { params: { name, address } });
      setStores(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [name, address]);

  // Load once on mount
  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRate = async (storeId, rating) => {
    setSavingId(storeId);
    try {
      await api.post(`/stores/${storeId}/rating`, { rating });
      // Update just that store's row locally instead of refetching everything
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, user_rating: rating } : s))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <Navbar title="Browse Stores" />
      <div className="page-content">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search by name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading...</p>}

        <div className="store-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card">
              <h3>{store.name}</h3>
              <p className="store-address">{store.address}</p>
              <p>
                Overall Rating:{' '}
                <strong>{Number(store.avg_rating).toFixed(1)}</strong> / 5
              </p>
              <p>Your Rating:</p>
              <StarRating
                value={store.user_rating || 0}
                onChange={(rating) => handleRate(store.id, rating)}
              />
              {savingId === store.id && <span className="saving">Saving...</span>}
              {store.user_rating && (
                <p className="hint">Click a star to change your rating</p>
              )}
            </div>
          ))}
          {!loading && stores.length === 0 && <p>No stores found.</p>}
        </div>
      </div>
    </div>
  );
}
