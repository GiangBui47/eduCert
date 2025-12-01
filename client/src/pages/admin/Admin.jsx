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

  const [activeTab, setActiveTab] = useState('users'); // users | premium-settings | premium-transactions | premium-summary

  // Users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [confirmState, setConfirmState] = useState({ open: false, user: null, loading: false });

  // Premium Settings
  const [settings, setSettings] = useState({ adaAddress: '', paypalEmail: '' });
  const [loadingSettings, setLoadingSettings] = useState(false);

  // Premium Transactions
  const [txLoading, setTxLoading] = useState(false);
  const [txItems, setTxItems] = useState([]);
  const [txTotal, setTxTotal] = useState(0);
  const [txPage, setTxPage] = useState(1);
  const [txPageSize, setTxPageSize] = useState(20);
  const [txFilter, setTxFilter] = useState({ status: '', plan: '', method: '', currency: '', user: '', from: '', to: '' });


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

  const fetchPremiumSettings = async () => {
    try {
      setLoadingSettings(true);
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/admin/premium/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setSettings({
          adaAddress: data.settings?.adaAddress || '',
          paypalEmail: data.settings?.paypalEmail || ''
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingSettings(false);
    }
  };

  const savePremiumSettings = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.patch(`${backendUrl}/api/admin/premium/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Settings saved');
        setSettings({
          adaAddress: data.settings?.adaAddress || '',
          paypalEmail: data.settings?.paypalEmail || ''
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchTransactions = async (page = txPage, pageSize = txPageSize) => {
    try {
      setTxLoading(true);
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/admin/premium/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...txFilter, page, pageSize }
      });
      if (data.success) {
        setTxItems(data.items || []);
        setTxTotal(data.total || 0);
        setTxPage(data.page || page);
        setTxPageSize(data.pageSize || pageSize);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'premium') {
      fetchPremiumSettings();
      fetchTransactions(1, txPageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, activeTab]);

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
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'users', label: 'Users' },
          { key: 'premium', label: 'Premium' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3 py-2 rounded border ${activeTab === t.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <>
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
                </tbody>
              </table>
            </div>
          )}

          {confirmState.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-semibold mb-2">Delete user</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete{' '}
                  <span className="font-medium">{confirmState.user?.name || confirmState.user?.email}</span>? This action cannot be undone.
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
        </>
      )}

      {activeTab === 'premium' && (
        <div className="max-w-xl">
          {loadingSettings ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ADA Receiver Address</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={settings.adaAddress}
                  onChange={(e) => setSettings(s => ({ ...s, adaAddress: e.target.value }))}
                  placeholder="addr_test1..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PayPal Business Email</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={settings.paypalEmail}
                  onChange={(e) => setSettings(s => ({ ...s, paypalEmail: e.target.value }))}
                  placeholder="business@example.com"
                />
              </div>
              <button onClick={savePremiumSettings} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'premium' && (
        <div className="space-y-4 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select className="border rounded px-2 py-2" value={txFilter.status} onChange={(e)=>setTxFilter(f=>({...f,status:e.target.value}))}>
              <option value="">Status</option>
              <option value="pending">pending</option>
              <option value="success">success</option>
              <option value="failed">failed</option>
            </select>
            <select className="border rounded px-2 py-2" value={txFilter.plan} onChange={(e)=>setTxFilter(f=>({...f,plan:e.target.value}))}>
              <option value="">Plan</option>
              <option value="monthly">monthly</option>
              <option value="yearly">yearly</option>
            </select>
            <select className="border rounded px-2 py-2" value={txFilter.method} onChange={(e)=>setTxFilter(f=>({...f,method:e.target.value}))}>
              <option value="">Method</option>
              <option value="ADA">ADA</option>
              <option value="PayPal">PayPal</option>
            </select>
            <select className="border rounded px-2 py-2" value={txFilter.currency} onChange={(e)=>setTxFilter(f=>({...f,currency:e.target.value}))}>
              <option value="">Currency</option>
              <option value="ADA">ADA</option>
              <option value="USD">USD</option>
            </select>
            <input className="border rounded px-2 py-2" placeholder="User ID" value={txFilter.user} onChange={(e)=>setTxFilter(f=>({...f,user:e.target.value}))} />
            <input type="date" className="border rounded px-2 py-2" value={txFilter.from} onChange={(e)=>setTxFilter(f=>({...f,from:e.target.value}))} />
            <input type="date" className="border rounded px-2 py-2" value={txFilter.to} onChange={(e)=>setTxFilter(f=>({...f,to:e.target.value}))} />
            <div className="flex gap-2">
              <button onClick={()=>fetchTransactions(1, txPageSize)} className="bg-blue-600 text-white px-4 py-2 rounded">Apply</button>
              <button onClick={()=>{setTxFilter({ status:'', plan:'', method:'', currency:'', user:'', from:'', to:'' }); fetchTransactions(1, txPageSize);}} className="border px-4 py-2 rounded">Reset</button>
            </div>
          </div>

          {txLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-2 border">User</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Currency</th>
                    <th className="p-2 border">Method</th>
                    <th className="p-2 border">Plan</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {txItems.map((t) => (
                    <tr key={t._id} className="border-t">
                      <td className="p-2 border">{t.user}</td>
                      <td className="p-2 border">{t.amount}</td>
                      <td className="p-2 border">{t.currency}</td>
                      <td className="p-2 border">{t.paymentMethod}</td>
                      <td className="p-2 border">{t.plan}</td>
                      <td className="p-2 border">{t.status}</td>
                      <td className="p-2 border">{new Date(t.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {txItems.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-gray-500">No transactions</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-3">
                <div>Page {txPage} / {Math.max(1, Math.ceil(txTotal / txPageSize))} • Total {txTotal}</div>
                <div className="flex gap-2">
                  <button disabled={txPage<=1} onClick={()=>fetchTransactions(txPage-1, txPageSize)} className="border px-3 py-1 rounded disabled:opacity-50">Prev</button>
                  <button disabled={txPage>=Math.ceil(txTotal/txPageSize)} onClick={()=>fetchTransactions(txPage+1, txPageSize)} className="border px-3 py-1 rounded disabled:opacity-50">Next</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      
    </div>
  );
};

export default Admin;
