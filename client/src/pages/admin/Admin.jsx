import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

const allowedRoles = ['student', 'educator', 'admin'];

const Admin = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const isAdmin = useMemo(() => user?.publicMetadata?.role === 'admin', [user]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [confirmState, setConfirmState] = useState({ open: false, user: null, loading: false });

  useEffect(() => {
    if (!isLoaded) return;
    if (!isAdmin) {
      toast.error('Unauthorized');
      navigate('/');
    }
  }, [isLoaded, isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { query }
      });
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const updateRole = async (id, role) => {
    try {
      const token = await getToken();
      const { data } = await axios.patch(`${backendUrl}/api/admin/users/${id}/role`, { role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Role updated');
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openDeleteDialog = (user) => setConfirmState({ open: true, user, loading: false });

  const performDelete = async () => {
    if (!confirmState.user) return;
    try {
      setConfirmState(s => ({ ...s, loading: true }));
      const token = await getToken();
      const { data } = await axios.delete(`${backendUrl}/api/admin/users/${confirmState.user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('User deleted');
        setUsers(prev => prev.filter(u => u.id !== confirmState.user.id));
        setConfirmState({ open: false, user: null, loading: false });
      } else {
        toast.error(data.message);
        setConfirmState(s => ({ ...s, loading: false }));
      }
    } catch (err) {
      toast.error(err.message);
      setConfirmState(s => ({ ...s, loading: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Admin - User Management</h1>

      <div className="flex items-center gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 w-full max-w-md"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Enrolled</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-2 border">
                    <div className="flex items-center gap-2">
                      <img src={u.imageUrl} alt="avatar" className="w-8 h-8 rounded-full" />
                      <span>{u.name || '—'}</span>
                    </div>
                  </td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">
                    <select
                      className="border rounded px-2 py-1"
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                    >
                      {allowedRoles.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border">{u.enrolledCount ?? 0}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => openDeleteDialog(u)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No users</td>
                </tr>
              )}

      {confirmState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Delete user</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete
              {' '}<span className="font-medium">{confirmState.user?.name || confirmState.user?.email}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmState({ open: false, user: null, loading: false })}
                disabled={confirmState.loading}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                disabled={confirmState.loading}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {confirmState.loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
