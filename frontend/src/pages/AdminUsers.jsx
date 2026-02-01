import React, { useEffect, useState } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers(pagination.page);
  }, [pagination.page]);

  const fetchUsers = (page = 1) => {
    const token = localStorage.getItem('adminToken');
    fetch(`/api/admin/users?page=${page}&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUsers(data.data.users || []);
          setPagination(data.data.pagination || pagination);
        } else {
          setUsers(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title mb-2">User Management</h1>
      <p className="admin-page-subtitle mb-4">Registered users and roles</p>

      <div className="admin-table-wrap">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><span className="badge bg-secondary">{user.role || 'user'}</span></td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="admin-pagination-wrap">
          <div className="admin-pagination-info">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
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