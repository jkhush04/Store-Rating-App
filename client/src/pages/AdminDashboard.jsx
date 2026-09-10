import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import AddUserForm from '../components/AddUserForm';
import AddStoreForm from '../components/AddStoreForm';

const USER_COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  { key: 'role', label: 'Role', sortable: true }
];

const STORE_COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  {
    key: 'avg_rating',
    label: 'Rating',
    sortable: true,
    render: (row) => Number(row.avg_rating).toFixed(1)
  }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const [users, setUsers] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [userSort, setUserSort] = useState({ sortBy: 'name', order: 'asc' });

  const [stores, setStores] = useState([]);
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', order: 'asc' });

  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    const res = await api.get('/admin/dashboard');
    setStats(res.data.data);
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await api.get('/admin/users', {
      params: { ...userFilters, ...userSort }
    });
    setUsers(res.data.data);
  }, [userFilters, userSort]);

  const fetchStores = useCallback(async () => {
    const res = await api.get('/admin/stores', {
      params: { ...storeFilters, ...storeSort }
    });
    setStores(res.data.data);
  }, [storeFilters, storeSort]);

  const loadAll = useCallback(async () => {
    try {
      await Promise.all([fetchStats(), fetchUsers(), fetchStores()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    }
  }, [fetchStats, fetchUsers, fetchStores]);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const toggleUserSort = (key) => {
    setUserSort((prev) =>
      prev.sortBy === key
        ? { sortBy: key, order: prev.order === 'asc' ? 'desc' : 'asc' }
        : { sortBy: key, order: 'asc' }
    );
  };

  const toggleStoreSort = (key) => {
    setStoreSort((prev) =>
      prev.sortBy === key
        ? { sortBy: key, order: prev.order === 'asc' ? 'desc' : 'asc' }
        : { sortBy: key, order: 'asc' }
    );
  };

  return (
    <div>
      <Navbar title="Admin Dashboard" />
      <div className="page-content">
        {error && <p className="error">{error}</p>}

        {stats && (
          <div className="stat-cards">
            <div className="stat-card">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{stats.totalUsers}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Stores</span>
              <span className="stat-value">{stats.totalStores}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Ratings</span>
              <span className="stat-value">{stats.totalRatings}</span>
            </div>
          </div>
        )}

        <AddUserForm onCreated={loadAll} />
        <AddStoreForm onCreated={loadAll} />

        <h3>Users</h3>
        <div className="filter-bar">
          <input
            placeholder="Filter by name"
            value={userFilters.name}
            onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })}
          />
          <input
            placeholder="Filter by email"
            value={userFilters.email}
            onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
          />
          <input
            placeholder="Filter by address"
            value={userFilters.address}
            onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })}
          />
          <select
            value={userFilters.role}
            onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">Normal User</option>
            <option value="owner">Store Owner</option>
          </select>
        </div>
        <DataTable
          columns={USER_COLUMNS}
          data={users}
          sortBy={userSort.sortBy}
          order={userSort.order}
          onSortChange={toggleUserSort}
        />

        <h3>Stores</h3>
        <div className="filter-bar">
          <input
            placeholder="Filter by name"
            value={storeFilters.name}
            onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })}
          />
          <input
            placeholder="Filter by email"
            value={storeFilters.email}
            onChange={(e) => setStoreFilters({ ...storeFilters, email: e.target.value })}
          />
          <input
            placeholder="Filter by address"
            value={storeFilters.address}
            onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })}
          />
        </div>
        <DataTable
          columns={STORE_COLUMNS}
          data={stores}
          sortBy={storeSort.sortBy}
          order={storeSort.order}
          onSortChange={toggleStoreSort}
        />
      </div>
    </div>
  );
}
