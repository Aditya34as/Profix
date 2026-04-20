import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import {
  Shield, CheckCircle, XCircle, Loader, ArrowLeft, MapPin, AlertTriangle,
  LayoutDashboard, Clock, Store, Users, FileText, Search, Trash2,
  Ban, RotateCcw, ChevronLeft, ChevronRight, TrendingUp, Star,
  Inbox, Eye, Phone, Mail, Calendar, Filter, RefreshCw, Menu, X
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TABS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pending', label: 'Approvals', icon: Clock },
  { id: 'shops', label: 'All Shops', icon: Store },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'leads', label: 'All Leads', icon: FileText },
];

const SERVICE_LABELS = {
  'ac-repair': 'AC Repair',
  'plumbing': 'Plumbing',
  'water-heater': 'Geyser',
  'cleaning': 'Cleaning',
  'electrical': 'Electrical',
  'carpentry': 'Carpentry',
  'painting': 'Painting',
  'pest-control': 'Pest Control',
};

const STATUS_COLORS = {
  approved: { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534', label: '● Live' },
  pending: { bg: '#fefce8', border: '#fde68a', color: '#92400e', label: '● Pending' },
  suspended: { bg: '#fef2f2', border: '#fecaca', color: '#991b1b', label: '● Suspended' },
};

const LEAD_STATUS_COLORS = {
  new: { bg: '#eff6ff', color: '#1e40af' },
  contacted: { bg: '#fefce8', color: '#92400e' },
  completed: { bg: '#f0fdf4', color: '#166534' },
  cancelled: { bg: '#fef2f2', color: '#991b1b' },
};

const AdminPanel = () => {
  const { token, isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/auth', { replace: true });
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  if (authLoading) {
    return (
      <div style={s.gatePage}>
        <Loader size={32} className="admin-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={s.gatePage}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <AlertTriangle size={48} color="#dc2626" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#1e293b' }}>Access Denied</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            You do not have admin privileges. Please sign in with an admin account.
          </p>
          <Link to="/auth" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '10px',
            backgroundColor: 'var(--color-primary)', color: '#fff',
            fontWeight: '700', textDecoration: 'none',
          }}>
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin Console | Pro Fix" noindex />
      <style>{adminCSS}</style>

      <div style={s.layout}>
        {/* Mobile hamburger toggle  */}
        <button
          className="admin-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Overlay for mobile */}
        {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div style={s.sidebarHeader}>
            <Shield size={28} color="#6366f1" />
            <div>
              <div style={s.sidebarTitle}>Admin Console</div>
              <div style={s.sidebarSub}>Pro Fix Platform</div>
            </div>
          </div>

          <nav style={s.sidebarNav}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`admin-nav-btn ${active ? 'active' : ''}`}
                >
                  <Icon size={19} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div style={s.sidebarFooter}>
            <Link to="/" style={s.exitBtn}>
              <ArrowLeft size={16} /> Exit Admin
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main style={s.main}>
          {activeTab === 'overview' && <OverviewTab token={token} />}
          {activeTab === 'pending' && <PendingTab token={token} />}
          {activeTab === 'shops' && <AllShopsTab token={token} />}
          {activeTab === 'customers' && <CustomersTab token={token} />}
          {activeTab === 'leads' && <LeadsTab token={token} />}
        </main>
      </div>
    </>
  );
};

/* ──────────────────────────────────────────────────────────
   TAB 1 — DASHBOARD OVERVIEW (KPIs)
────────────────────────────────────────────────────────── */
const OverviewTab = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/shops/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <TabLoader />;
  if (!stats) return <p style={s.muted}>Could not load stats.</p>;

  const kpis = [
    { label: 'Total Shops', value: stats.totalShops, icon: Store, color: '#6366f1', bg: '#eef2ff' },
    { label: 'Live Shops', value: stats.approvedShops, icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Pending', value: stats.pendingShops, icon: Clock, color: '#d97706', bg: '#fffbeb' },
    { label: 'Suspended', value: stats.suspendedShops, icon: Ban, color: '#dc2626', bg: '#fef2f2' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: '#0891b2', bg: '#ecfeff' },
    { label: 'Total Leads', value: stats.totalLeads, icon: Inbox, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Reviews', value: stats.totalReviews, icon: Star, color: '#ea580c', bg: '#fff7ed' },
    { label: 'Avg Rating', value: stats.avgRating ? `${stats.avgRating}★` : 'N/A', icon: TrendingUp, color: '#059669', bg: '#ecfdf5' },
  ];

  return (
    <div>
      <h2 style={s.tabTitle}>Platform Overview</h2>
      <p style={s.tabSub}>Real-time metrics for your marketplace.</p>

      <div className="admin-kpi-grid">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="admin-kpi-card" style={{ '--kpi-accent': kpi.color, '--kpi-bg': kpi.bg }}>
              <div className="admin-kpi-icon">
                <Icon size={22} color={kpi.color} />
              </div>
              <div className="admin-kpi-value">{kpi.value}</div>
              <div className="admin-kpi-label">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      {/* Lead Breakdown */}
      {stats.leadsByStatus && Object.keys(stats.leadsByStatus).length > 0 && (
        <div className="admin-card" style={{ marginTop: '28px' }}>
          <h3 style={s.cardTitle}>Leads by Status</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
            {Object.entries(stats.leadsByStatus).map(([status, count]) => {
              const sc = LEAD_STATUS_COLORS[status] || { bg: '#f1f5f9', color: '#475569' };
              return (
                <div
                  key={status}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: sc.bg,
                    color: sc.color,
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{ fontSize: '1.3rem', fontWeight: '900' }}>{count}</span>
                  <span style={{ textTransform: 'capitalize' }}>{status}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   TAB 2 — PENDING APPROVALS
────────────────────────────────────────────────────────── */
const PendingTab = ({ token }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/shops/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setShops(data.shops || []);
      else setError(data.error || 'Failed to load');
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const setApproval = async (id, approved) => {
    setActionId(id);
    try {
      const res = await fetch(`${API_URL}/api/shops/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approved }),
      });
      const data = await res.json();
      if (data.success) setShops(prev => prev.filter(s => s._id !== id));
      else setError(data.error || 'Action failed');
    } catch {
      setError('Request failed');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h2 style={s.tabTitle}>Pending Approvals</h2>
          <p style={s.tabSub}>Review and approve new business registrations.</p>
        </div>
        <button onClick={fetchPending} disabled={loading} className="admin-refresh-btn">
          <RefreshCw size={16} className={loading ? 'admin-spin' : ''} /> Refresh
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading && shops.length === 0 ? (
        <TabLoader />
      ) : shops.length === 0 ? (
        <div className="admin-empty">
          <CheckCircle size={40} color="#16a34a" />
          <p>No pending shops. You're all caught up! 🎉</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {shops.map(shop => (
            <div key={shop._id} className="admin-card admin-shop-row">
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{shop.businessName}</strong>
                  <StatusBadge status="pending" />
                </div>
                <div className="admin-meta">
                  <span><Users size={13} /> {shop.ownerName}</span>
                  <span><Mail size={13} /> {shop.email}</span>
                  <span><Phone size={13} /> {shop.phone}</span>
                </div>
                {shop.address?.city && (
                  <div className="admin-meta">
                    <span><MapPin size={13} /> {[shop.address.street, shop.address.city, shop.address.state].filter(Boolean).join(', ')}{shop.address.pincode ? ` - ${shop.address.pincode}` : ''}</span>
                  </div>
                )}
                <div className="admin-meta">
                  <span>Services: {shop.services?.map(s => SERVICE_LABELS[s] || s).join(', ')}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={() => setApproval(shop._id, true)}
                  disabled={actionId === shop._id}
                  className="admin-btn admin-btn-approve"
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button
                  onClick={() => setApproval(shop._id, false)}
                  disabled={actionId === shop._id}
                  className="admin-btn admin-btn-reject"
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   TAB 3 — ALL SHOPS MANAGEMENT
────────────────────────────────────────────────────────── */
const AllShopsTab = ({ token }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: '', service: '', search: '' });
  const [actionId, setActionId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchShops = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page });
      if (filters.status) params.set('status', filters.status);
      if (filters.service) params.set('service', filters.service);
      if (filters.search) params.set('search', filters.search);

      const res = await fetch(`${API_URL}/api/shops/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setShops(data.shops);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to load');
      }
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  useEffect(() => { fetchShops(); }, [fetchShops]);

  const handleSuspend = async (id) => {
    setActionId(id);
    try {
      const res = await fetch(`${API_URL}/api/shops/${id}/suspend`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setShops(prev => prev.map(shop =>
          shop._id === id ? { ...shop, isActive: data.shop.isActive } : shop
        ));
      }
    } catch {
      setError('Suspend action failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    setActionId(id);
    try {
      const res = await fetch(`${API_URL}/api/shops/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setShops(prev => prev.filter(s => s._id !== id));
        setDeleteConfirm(null);
      } else {
        setError(data.error || 'Delete failed');
      }
    } catch {
      setError('Delete action failed');
    } finally {
      setActionId(null);
    }
  };

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      const res = await fetch(`${API_URL}/api/shops/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approved: true }),
      });
      const data = await res.json();
      if (data.success) {
        setShops(prev => prev.map(shop =>
          shop._id === id ? { ...shop, isApproved: true } : shop
        ));
      }
    } catch {
      setError('Approve action failed');
    } finally {
      setActionId(null);
    }
  };

  const getShopStatus = (shop) => {
    if (!shop.isActive) return 'suspended';
    if (!shop.isApproved) return 'pending';
    return 'approved';
  };

  return (
    <div>
      <h2 style={s.tabTitle}>All Shops</h2>
      <p style={s.tabSub}>Manage every registered business on the platform.</p>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search-wrap">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, owner, email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && fetchShops()}
            className="admin-search-input"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="admin-filter-select"
        >
          <option value="">All Status</option>
          <option value="approved">Live</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={filters.service}
          onChange={(e) => setFilters({ ...filters, service: e.target.value })}
          className="admin-filter-select"
        >
          <option value="">All Services</option>
          {Object.entries(SERVICE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button onClick={() => fetchShops()} className="admin-refresh-btn" disabled={loading}>
          <Filter size={16} /> Apply
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <TabLoader />
      ) : shops.length === 0 ? (
        <div className="admin-empty">
          <Store size={40} color="#94a3b8" />
          <p>No shops found matching your filters.</p>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
            Showing {shops.length} of {pagination.total} shops
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {shops.map(shop => {
              const status = getShopStatus(shop);
              return (
                <div key={shop._id} className="admin-card admin-shop-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1.05rem' }}>{shop.businessName}</strong>
                      <StatusBadge status={status} />
                    </div>
                    <div className="admin-meta">
                      <span><Users size={13} /> {shop.ownerName}</span>
                      <span><Mail size={13} /> {shop.email}</span>
                      <span><Phone size={13} /> {shop.phone}</span>
                    </div>
                    <div className="admin-meta">
                      {shop.address?.city && <span><MapPin size={13} /> {shop.address.city}{shop.address.state ? `, ${shop.address.state}` : ''}</span>}
                      <span><Star size={13} /> {shop.rating || 0}★ ({shop.totalReviews || 0} reviews)</span>
                      <span><Calendar size={13} /> {new Date(shop.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="admin-meta">
                      <span>Services: {shop.services?.map(sv => SERVICE_LABELS[sv] || sv).join(', ')}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    {!shop.isApproved && (
                      <button onClick={() => handleApprove(shop._id)} disabled={actionId === shop._id} className="admin-btn admin-btn-approve" style={{ fontSize: '0.8rem' }}>
                        <CheckCircle size={14} /> Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleSuspend(shop._id)}
                      disabled={actionId === shop._id}
                      className={`admin-btn ${shop.isActive ? 'admin-btn-warn' : 'admin-btn-approve'}`}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {shop.isActive ? <><Ban size={14} /> Suspend</> : <><RotateCcw size={14} /> Reactivate</>}
                    </button>
                    {deleteConfirm === shop._id ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => handleDelete(shop._id)} disabled={actionId === shop._id} className="admin-btn admin-btn-danger" style={{ fontSize: '0.78rem', flex: 1 }}>
                          Confirm
                        </button>
                        <button onClick={() => setDeleteConfirm(null)} className="admin-btn admin-btn-ghost" style={{ fontSize: '0.78rem' }}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(shop._id)} className="admin-btn admin-btn-danger" style={{ fontSize: '0.8rem' }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination pagination={pagination} onPage={(p) => fetchShops(p)} />
        </>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   TAB 4 — CUSTOMERS
────────────────────────────────────────────────────────── */
const CustomersTab = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page });
      if (search) params.set('search', search);

      const res = await fetch(`${API_URL}/api/users/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return (
    <div>
      <h2 style={s.tabTitle}>All Customers</h2>
      <p style={s.tabSub}>Registered customer accounts on the platform.</p>

      <div className="admin-filters">
        <div className="admin-search-wrap" style={{ maxWidth: '400px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            className="admin-search-input"
          />
        </div>
        <button onClick={() => fetchUsers()} className="admin-refresh-btn" disabled={loading}>
          <Search size={16} /> Search
        </button>
      </div>

      {loading ? (
        <TabLoader />
      ) : users.length === 0 ? (
        <div className="admin-empty">
          <Users size={40} color="#94a3b8" />
          <p>No customers found.</p>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
            Showing {users.length} of {pagination.total} customers
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPage={(p) => fetchUsers(p)} />
        </>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   TAB 5 — ALL LEADS
────────────────────────────────────────────────────────── */
const LeadsTab = ({ token }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: '', service: '' });

  const fetchLeads = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page });
      if (filters.status) params.set('status', filters.status);
      if (filters.service) params.set('service', filters.service);

      const res = await fetch(`${API_URL}/api/shops/admin/leads?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  return (
    <div>
      <h2 style={s.tabTitle}>All Service Leads</h2>
      <p style={s.tabSub}>Every service request across all shops.</p>

      <div className="admin-filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="admin-filter-select"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={filters.service}
          onChange={(e) => setFilters({ ...filters, service: e.target.value })}
          className="admin-filter-select"
        >
          <option value="">All Services</option>
          {Object.entries(SERVICE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button onClick={() => fetchLeads()} className="admin-refresh-btn" disabled={loading}>
          <Filter size={16} /> Apply
        </button>
      </div>

      {loading ? (
        <TabLoader />
      ) : leads.length === 0 ? (
        <div className="admin-empty">
          <FileText size={40} color="#94a3b8" />
          <p>No leads found.</p>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
            Showing {leads.length} of {pagination.total} leads
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Shop</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => {
                  const sc = LEAD_STATUS_COLORS[lead.status] || { bg: '#f1f5f9', color: '#475569' };
                  return (
                    <tr key={lead._id}>
                      <td><strong>{lead.name}</strong></td>
                      <td>{lead.phone}</td>
                      <td>{SERVICE_LABELS[lead.serviceRequested] || lead.serviceRequested}</td>
                      <td>{lead.shopId?.businessName || '—'}</td>
                      <td>
                        <span style={{
                          padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem',
                          fontWeight: '700', background: sc.bg, color: sc.color, textTransform: 'capitalize',
                        }}>
                          {lead.status}
                        </span>
                      </td>
                      <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPage={(p) => fetchLeads(p)} />
        </>
      )}
    </div>
  );
};


/* ──────────────────────────────────────────────────────────
   SHARED COMPONENTS
────────────────────────────────────────────────────────── */
const TabLoader = () => (
  <div style={{ padding: '60px 0', textAlign: 'center' }}>
    <Loader size={28} className="admin-spin" style={{ color: '#6366f1' }} />
    <p style={{ color: '#94a3b8', marginTop: '12px' }}>Loading…</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const sc = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700',
      background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, whiteSpace: 'nowrap',
    }}>
      {sc.label}
    </span>
  );
};

const Pagination = ({ pagination, onPage }) => {
  if (pagination.totalPages <= 1) return null;
  return (
    <div className="admin-pagination">
      <button
        disabled={pagination.page <= 1}
        onClick={() => onPage(pagination.page - 1)}
        className="admin-page-btn"
      >
        <ChevronLeft size={16} /> Prev
      </button>
      <span style={{ fontSize: '0.88rem', color: '#475569', fontWeight: '600' }}>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => onPage(pagination.page + 1)}
        className="admin-page-btn"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};


/* ──────────────────────────────────────────────────────────
   STYLES (inline for base, CSS for interactive/responsive)
────────────────────────────────────────────────────────── */
const s = {
  gatePage: {
    minHeight: 'calc(100vh - 84px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  layout: {
    display: 'flex',
    minHeight: 'calc(100vh - 84px)',
    background: '#f1f5f9',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '28px 24px 24px',
    borderBottom: '1px solid #e2e8f0',
  },
  sidebarTitle: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.03em',
  },
  sidebarSub: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: '600',
  },
  sidebarNav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sidebarFooter: {
    padding: '16px 20px',
    borderTop: '1px solid #e2e8f0',
  },
  exitBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '0.88rem',
    textDecoration: 'none',
  },
  main: {
    flex: 1,
    padding: 'clamp(24px, 3vw, 40px)',
    overflowY: 'auto',
    maxWidth: '1100px',
  },
  tabTitle: {
    fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
    fontWeight: '800',
    margin: '0 0 6px',
    color: '#0f172a',
    letterSpacing: '-0.03em',
  },
  tabSub: {
    fontSize: '0.95rem',
    color: '#64748b',
    margin: '0 0 24px',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    margin: 0,
    color: '#0f172a',
  },
  muted: { color: '#94a3b8' },
};

/* CSS-in-JS string for hover states, responsive, animations */
const adminCSS = `
  /* Animations */
  @keyframes admin-spin-kf { to { transform: rotate(360deg); } }
  .admin-spin { animation: admin-spin-kf 0.8s linear infinite; }

  /* Sidebar */
  .admin-sidebar {
    width: 260px;
    background: #fff;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    z-index: 100;
  }

  .admin-sidebar-toggle {
    display: none;
    position: fixed;
    top: 96px;
    left: 14px;
    z-index: 200;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    color: #0f172a;
  }

  .admin-sidebar-overlay {
    display: none;
  }

  /* Sidebar nav buttons */
  .admin-nav-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 16px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: #64748b;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    width: 100%;
    text-align: left;
  }
  .admin-nav-btn:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
  .admin-nav-btn.active {
    background: linear-gradient(135deg, #eef2ff, #e0e7ff);
    color: #4338ca;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(99,102,241,0.1);
  }

  /* KPI cards */
  .admin-kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 16px;
  }
  .admin-kpi-card {
    background: #fff;
    border-radius: 16px;
    padding: 22px 20px;
    border: 1px solid #e2e8f0;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
  }
  .admin-kpi-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--kpi-accent);
    border-radius: 16px 16px 0 0;
  }
  .admin-kpi-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }
  .admin-kpi-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--kpi-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
  }
  .admin-kpi-value {
    font-size: 1.6rem;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 4px;
  }
  .admin-kpi-label {
    font-size: 0.78rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* Cards */
  .admin-card {
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    border: 1px solid #e2e8f0;
  }
  .admin-shop-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }

  /* Meta info rows */
  .admin-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 8px;
    font-size: 0.83rem;
    color: #64748b;
  }
  .admin-meta span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  /* Buttons */
  .admin-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 14px;
    border-radius: 8px;
    border: none;
    font-weight: 650;
    font-size: 0.85rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .admin-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .admin-btn-approve { background: #16a34a; color: #fff; }
  .admin-btn-approve:hover:not(:disabled) { background: #15803d; }
  .admin-btn-reject { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
  .admin-btn-reject:hover:not(:disabled) { background: #fee2e2; }
  .admin-btn-warn { background: #fefce8; color: #a16207; border: 1px solid #fde68a; }
  .admin-btn-warn:hover:not(:disabled) { background: #fef9c3; }
  .admin-btn-danger { background: #dc2626; color: #fff; }
  .admin-btn-danger:hover:not(:disabled) { background: #b91c1c; }
  .admin-btn-ghost { background: transparent; color: #64748b; border: 1px solid #e2e8f0; }
  .admin-btn-ghost:hover:not(:disabled) { background: #f1f5f9; }

  .admin-refresh-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: #fff;
    color: #475569;
    font-weight: 650;
    font-size: 0.85rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
  }
  .admin-refresh-btn:hover:not(:disabled) { background: #f8fafc; border-color: #6366f1; color: #6366f1; }

  /* Filters */
  .admin-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
  }
  .admin-search-wrap {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 200px;
    max-width: 360px;
  }
  .admin-search-wrap svg {
    position: absolute;
    left: 12px;
    color: #94a3b8;
    pointer-events: none;
  }
  .admin-search-input {
    width: 100%;
    padding: 10px 14px 10px 36px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-size: 0.88rem;
    font-family: inherit;
    background: #fff;
    transition: border-color 0.2s;
    outline: none;
  }
  .admin-search-input:focus { border-color: #6366f1; }
  .admin-filter-select {
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-size: 0.85rem;
    font-family: inherit;
    background: #fff;
    cursor: pointer;
    outline: none;
    min-width: 130px;
  }
  .admin-filter-select:focus { border-color: #6366f1; }

  /* Table */
  .admin-table-wrap {
    overflow-x: auto;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    background: #fff;
  }
  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
  }
  .admin-table th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 700;
    color: #475569;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .admin-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    vertical-align: middle;
  }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: #f8fafc; }

  /* Pagination */
  .admin-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
    padding: 16px 0;
  }
  .admin-page-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #fff;
    color: #475569;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
  }
  .admin-page-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; }
  .admin-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Error & Empty states */
  .admin-error {
    color: #b91c1c;
    font-weight: 600;
    padding: 12px 16px;
    border-radius: 10px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    margin-bottom: 16px;
  }
  .admin-empty {
    text-align: center;
    padding: 60px 20px;
    color: #94a3b8;
    font-weight: 600;
  }
  .admin-empty p { margin: 12px 0 0; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .admin-sidebar {
      position: fixed;
      top: 0;
      left: -280px;
      width: 270px;
      height: 100vh;
      transition: left 0.3s cubic-bezier(0.16,1,0.3,1);
      z-index: 300;
      box-shadow: 4px 0 24px rgba(0,0,0,0.12);
    }
    .admin-sidebar.open {
      left: 0;
    }
    .admin-sidebar-toggle {
      display: flex;
    }
    .admin-sidebar-overlay {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 250;
    }
    .admin-kpi-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .admin-shop-row {
      flex-direction: column;
    }
  }
  @media (max-width: 480px) {
    .admin-kpi-grid {
      grid-template-columns: 1fr;
    }
    .admin-filters {
      flex-direction: column;
      align-items: stretch;
    }
    .admin-search-wrap {
      max-width: 100%;
    }
  }
`;

export default AdminPanel;
