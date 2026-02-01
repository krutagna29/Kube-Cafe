import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const { displayOrderId, finalAmount } = location.state || {};

  return (
    <div className="container py-5 text-center">
      <h2 className="mb-3">Thank you for your order! 🎉</h2>
      <p className="mb-2">Your order has been received and is now being prepared.</p>

      <div className="card mx-auto mt-4" style={{ maxWidth: 480 }}>
        <div className="card-body">
          <h5 className="card-title mb-3">Order Details</h5>
          <p className="mb-1">
            <strong>Order ID:</strong> {displayOrderId || `#${orderId}`}
          </p>
          <p className="mb-1">
            <strong>Status:</strong> Preparing
          </p>
          <p className="mb-3">
            <strong>Total:</strong> ₹{finalAmount?.toFixed?.(2) || '—'}
          </p>
          <p className="text-muted small mb-3">
            Estimated time: 20–30 minutes for delivery, 15–20 minutes for pickup.
          </p>

          <Link to="/admin/orders" className="btn btn-outline-secondary me-2">
            Track (admin)
          </Link>
          <Link to="/menu" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

