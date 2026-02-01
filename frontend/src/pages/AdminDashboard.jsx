import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      navigate('/admin/login');
      return;
    }

    const loadData = async () => {
      try {
        const [dashRes, ordersRes, menuRes] = await Promise.all([
          fetch('/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/admin/orders', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/menu')
        ]);

        if (!dashRes.ok) throw new Error('Failed to fetch dashboard stats');
        if (!ordersRes.ok) throw new Error('Failed to fetch orders');
        if (!menuRes.ok) throw new Error('Failed to fetch menu items');

        const dashData = await dashRes.json();
        const ordersData = await ordersRes.json();
        const menuData = await menuRes.json();

        // Handle new standardized response format
        setStats(dashData.success ? dashData.data.stats : dashData.stats);
        setOrders(ordersData.success ? (ordersData.data.orders || ordersData.data) : ordersData);
        setMenuItems(menuData.success ? (menuData.data.items || menuData.data) : menuData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Unable to load dashboard data.');
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger">{error}</div>;

  // Derived metrics
  const today = new Date();
  const isToday = (dateStr) => new Date(dateStr).toDateString() === today.toDateString();

  const todayOrders = orders.filter(o => isToday(o.order_date));
  const todaySales = todayOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const todayOrderCount = todayOrders.length;
  const avgOrderValue = todayOrderCount ? todaySales / todayOrderCount : 0;

  const todayCustomerSet = new Set(
    todayOrders.map(o => o.user_id || o.user_email || o.user_name)
  );
  const todayCustomers = todayCustomerSet.size;

  const todayItemsSold = todayOrders.reduce((sum, o) => {
    if (!o.items) return sum;
    return sum + o.items.reduce((s, it) => s + Number(it.quantity || 0), 0);
  }, 0);

  // Sales by hour for today
  const hourlySales = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    total: 0
  }));
  todayOrders.forEach(o => {
    const d = new Date(o.order_date);
    const h = d.getHours();
    hourlySales[h].total += Number(o.total_amount || 0);
  });
  const maxHourly = Math.max(...hourlySales.map(h => h.total), 1);

  // Status breakdown
  const statusCounts = ORDER_STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
  todayOrders.forEach(o => {
    if (o.status && statusCounts[o.status] !== undefined) {
      statusCounts[o.status] += 1;
    }
  });
  const totalStatus = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;

  // Top items (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentOrders = orders.filter(o => new Date(o.order_date) >= sevenDaysAgo);
  const itemMap = new Map();
  recentOrders.forEach(o => {
    (o.items || []).forEach(it => {
      const name = it.menu_item_name || `Item #${it.menu_item_id}`;
      const key = `${it.menu_item_id}-${name}`;
      const qty = Number(it.quantity || 0);
      const rev = Number(it.price || 0) * qty;
      const existing = itemMap.get(key) || { name, qty: 0, revenue: 0 };
      existing.qty += qty;
      existing.revenue += rev;
      itemMap.set(key, existing);
    });
  });
  const topItems = Array.from(itemMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Recent orders table (latest 5)
  const latestOrders = [...orders]
    .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
    .slice(0, 5);

  // Low stock / unavailable items (using is_available flag)
  const lowStockItems = menuItems.filter(m => m.is_available === 0 || m.is_available === false);

  return (
    <div className="admin-page admin-dashboard container-fluid py-3">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title mb-1">Kube Café Admin Dashboard</h1>
          <p className="admin-page-subtitle mb-0">POS + Analytics overview for your café</p>
        </div>
        <div className="text-end">
          <div className="fw-semibold">Today</div>
          <div className="text-muted small">{today.toLocaleDateString()}</div>
          <div className="small text-muted">Outlet: Main Café</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <motion.div
          className="col-6 col-md-4 col-lg-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card shadow-sm border-0 h-100" style={{ background: '#fdf3e7' }}>
            <div className="card-body py-3">
              <div className="small text-muted mb-1">Today’s Sales</div>
              <div className="h5 mb-0">₹{todaySales.toFixed(2)}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="col-6 col-md-4 col-lg-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className="card shadow-sm border-0 h-100" style={{ background: '#e8f5e9' }}>
            <div className="card-body py-3">
              <div className="small text-muted mb-1">Today’s Orders</div>
              <div className="h5 mb-0">{todayOrderCount}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="col-6 col-md-4 col-lg-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="card shadow-sm border-0 h-100" style={{ background: '#e3f2fd' }}>
            <div className="card-body py-3">
              <div className="small text-muted mb-1">Avg Order Value</div>
              <div className="h5 mb-0">₹{avgOrderValue.toFixed(2)}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="col-6 col-md-4 col-lg-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="card shadow-sm border-0 h-100" style={{ background: '#f3e5f5' }}>
            <div className="card-body py-3">
              <div className="small text-muted mb-1">Customers Today</div>
              <div className="h5 mb-0">{todayCustomers}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="col-6 col-md-4 col-lg-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="card shadow-sm border-0 h-100" style={{ background: '#fff3e0' }}>
            <div className="card-body py-3">
              <div className="small text-muted mb-1">Items Sold</div>
              <div className="h5 mb-0">{todayItemsSold}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="col-6 col-md-4 col-lg-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body py-3">
              <div className="small text-muted mb-1">Total Users</div>
              <div className="h5 mb-0">{stats?.totalUsers ?? 'N/A'}</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="row g-3 mb-4">
        {/* Sales chart */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Today’s Sales (Hourly)</h6>
                <span className="text-muted small">Peak hours insight</span>
              </div>
              <div className="admin-chart-bars">
                {hourlySales.map(h => (
                  <div key={h.hour} className="admin-chart-bar-item">
                    <div
                      className="bar-fill mx-auto"
                      style={{
                        height: `${(h.total / maxHourly) * 100 || 0}%`,
                        background: '#6f4e37'
                      }}
                    />
                    <div className="small text-muted" style={{ fontSize: '0.6rem' }}>
                      {h.hour}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="mb-2">Order Status Breakdown</h6>
              <p className="text-muted small mb-3">Kitchen workflow overview</p>
              {ORDER_STATUSES.map(status => {
                const count = statusCounts[status] || 0;
                const pct = (count / totalStatus) * 100;
                return (
                  <div key={status} className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-capitalize">{status}</span>
                      <span className="text-muted">
                        {count} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div
                        className={`progress-bar ${status === 'ready' ? 'bg-success' : ''}`}
                        role="progressbar"
                        style={{ width: `${pct}%`, backgroundColor: '#6f4e37' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {/* Top items */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="mb-2">Top Selling Items (Last 7 days)</h6>
              <p className="text-muted small mb-3">Menu optimization insights</p>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Revenue (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topItems.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-muted small">
                          No data yet.
                        </td>
                      </tr>
                    ) : (
                      topItems.map(it => (
                        <tr key={it.name}>
                          <td>{it.name}</td>
                          <td>{it.qty}</td>
                          <td>₹{it.revenue.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="mb-2">Recent Orders</h6>
              <p className="text-muted small mb-3">Live café activity</p>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-muted small">
                          No orders yet.
                        </td>
                      </tr>
                    ) : (
                      latestOrders.map(o => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>{o.user_name || '-'}</td>
                          <td>₹{Number(o.total_amount || 0).toFixed(2)}</td>
                          <td className="text-capitalize">{o.status}</td>
                          <td>{new Date(o.order_date).toLocaleTimeString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Low stock / unavailable */}
      <div className="row g-3 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="mb-2">Low Stock / Unavailable Items</h6>
              <p className="text-muted small mb-3">Restock to avoid lost sales</p>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-muted small">
                          All items available.
                        </td>
                      </tr>
                    ) : (
                      lowStockItems.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>
                            <span className="badge bg-warning text-dark">Restock</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
