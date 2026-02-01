import React, { useEffect, useState } from 'react';

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled'
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [statusEdit, setStatusEdit] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    fetchOrders(pagination.page);
  }, [pagination.page]);

  const fetchOrders = (page = 1) => {
    const token = localStorage.getItem('adminToken');
    fetch(`/api/admin/orders?page=${page}&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setOrders(data.data.orders || []);
          setPagination(data.data.pagination || pagination);
        } else {
          // Fallback for old format
          setOrders(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusEdit(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleSaveStatus = async (orderId) => {
    setSaving(orderId);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: statusEdit[orderId] })
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title mb-2">Order Management</h1>
      <p className="admin-page-subtitle mb-4">View and update order status</p>

      <div className="admin-table-wrap admin-table-wrap--wide">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th></th>
            <th>Order ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Total</th>
            <th>Items</th>
            <th>Status</th>
            <th>Date</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <React.Fragment key={order.id}>
              <tr>
                {/* Expand / Collapse button */}
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      setExpanded(expanded === order.id ? null : order.id)
                    }
                  >
                    {expanded === order.id ? '-' : '+'}
                  </button>
                </td>

                <td>{order.id}</td>
                <td>{order.user_name || '-'}</td>
                <td>{order.user_email || '-'}</td>
                <td>₹{Number(order.total_amount).toFixed(2)}</td>

                {/* ✅ Clickable item names */}
                <td
                  style={{
                    cursor: 'pointer',
                    color: '#0d6efd',
                    textDecoration: 'underline',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#0056b3')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#0d6efd')}
                  onClick={() =>
                    setExpanded(expanded === order.id ? null : order.id)
                  }
                >
                  {order.items && order.items.length > 0
                    ? order.items.map(i => i.menu_item_name).join(', ')
                    : 'No items'}
                </td>

                <td>{order.status}</td>
                <td>{new Date(order.order_date).toLocaleString()}</td>
                <td>
                  <select
                    value={
                      statusEdit[order.id] !== undefined
                        ? statusEdit[order.id]
                        : order.status
                    }
                    onChange={e =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="form-select form-select-sm"
                  >
                    {ORDER_STATUSES.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-sm btn-primary ms-2"
                    disabled={
                      saving === order.id ||
                      (statusEdit[order.id] === undefined ||
                        statusEdit[order.id] === order.status)
                    }
                    onClick={() => handleSaveStatus(order.id)}
                  >
                    {saving === order.id ? 'Saving...' : 'Save'}
                  </button>
                </td>
              </tr>

              {/* Expanded details */}
              {expanded === order.id && (
                <tr>
                  <td colSpan={9}>
                    <strong>Items:</strong>
                    <table className="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items && order.items.length > 0 ? (
                          order.items.map(item => (
                            <tr key={item.id}>
                              <td>{item.menu_item_name || '-'}</td>
                              <td>{item.quantity}</td>
                              <td>₹{Number(item.price).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3}>No items</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="admin-pagination-wrap">
          <div className="admin-pagination-info">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
          </div>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPagination({...pagination, page: pagination.page - 1})} disabled={pagination.page === 1}>
                  Previous
                </button>
              </li>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <li key={i + 1} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPagination({...pagination, page: i + 1})}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPagination({...pagination, page: pagination.page + 1})} disabled={pagination.page === pagination.totalPages}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
