import React from 'react';
import AdminNav from './AdminNav';
import './AdminLayout.css';
import '../style/AdminPages.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout has-admin-nav">
      <AdminNav />
      <main className="admin-layout-main">
        {children}
      </main>
    </div>
  );
}
