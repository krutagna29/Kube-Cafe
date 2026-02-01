import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, userToken, isUserAuthenticated, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup'
  const [pickupSlot, setPickupSlot] = useState('in_20_min');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const taxAmount = useMemo(() => +(subtotal * 0.05).toFixed(2), [subtotal]); // 5% GST
  const deliveryFee = useMemo(
    () => (orderType === 'delivery' ? 40 : 0),
    [orderType]
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      return +(subtotal * (appliedCoupon.value / 100)).toFixed(2);
    }
    if (appliedCoupon.type === 'flat') {
      return appliedCoupon.value;
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const finalAmount = useMemo(
    () => +(subtotal + taxAmount + deliveryFee - discountAmount).toFixed(2),
    [subtotal, taxAmount, deliveryFee, discountAmount]
  );

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/menu');
    }
  }, [cart, navigate]);

  useEffect(() => {
    if (cart.length > 0 && !isUserAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [cart.length, isUserAuthenticated, navigate]);

  const handleChange = (e) => {
    setCustomer(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'KUBE10') {
      setAppliedCoupon({ code: 'KUBE10', type: 'percent', value: 10 });
      setError('');
    } else {
      setAppliedCoupon(null);
      setError('Invalid coupon code');
    }
  };

  const handlePlaceOrder = async () => {
    if (!customer.name || !customer.phone || !customer.email) {
      setError('Please fill all required customer details');
      return;
    }
    if (orderType === 'delivery' && !customer.address) {
      setError('Please provide delivery address');
      return;
    }

    setLoading(true);
    setError('');

    if (!userToken) {
      setError('Please log in to place an order');
      setLoading(false);
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    const payload = {
      customer_name: customer.name,
      email: customer.email,
      phone: customer.phone,
      order_type: orderType,
      delivery_address: orderType === 'delivery' ? customer.address : null,
      pickup_slot: orderType === 'pickup' ? pickupSlot : null,
      items: cart.map(item => ({
        menu_item_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      tax_amount: taxAmount,
      delivery_fee: deliveryFee,
      coupon_code: appliedCoupon?.code || null,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      total_amount: finalAmount, // required by backend validation
      payment_method: paymentMethod
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await res.json();
      } catch {
        if (res.status === 404) {
          setError('Cannot reach the server. Is the backend running on port 5000?');
          return;
        }
        if (res.status === 401) {
          logoutUser();
          setError('Session invalid. Please log in again.');
          setTimeout(() => navigate('/login', { state: { from: '/checkout' } }), 1500);
          return;
        }
        setError('Something went wrong.');
        return;
      }

      if (res.status === 401) {
        logoutUser();
        setError(data.message || 'Session expired. Please log in again.');
        setTimeout(() => navigate('/login', { state: { from: '/checkout' } }), 1500);
        return;
      }

      if (!res.ok || !data.success) {
        const msg = data.message || 'Failed to place order';
        const details = data.errors?.map(e => e.msg || e.message).join('. ');
        setError(details ? `${msg}: ${details}` : msg);
        return;
      }

      const { orderId, displayOrderId } = data.data;

      clearCart();
      navigate(`/order-confirmation/${orderId}`, {
        state: { displayOrderId, finalAmount }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Checkout</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-lg-7 mb-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Customer Details</h5>
              <div className="mb-3">
                <label className="form-label">Name *</label>
                <input
                  name="name"
                  className="form-control"
                  value={customer.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mobile *</label>
                <input
                  name="phone"
                  className="form-control"
                  value={customer.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email *</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  value={customer.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Order Type</h5>
              <div className="btn-group mb-3" role="group">
                <button
                  type="button"
                  className={`btn btn-outline-primary ${orderType === 'delivery' ? 'active' : ''}`}
                  onClick={() => setOrderType('delivery')}
                >
                  Delivery
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-primary ${orderType === 'pickup' ? 'active' : ''}`}
                  onClick={() => setOrderType('pickup')}
                >
                  Pickup
                </button>
              </div>

              {orderType === 'delivery' && (
                <div className="mb-3">
                  <label className="form-label">Delivery Address *</label>
                  <textarea
                    name="address"
                    className="form-control"
                    rows="3"
                    value={customer.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {orderType === 'pickup' && (
                <div className="mb-3">
                  <label className="form-label">Pickup Time</label>
                  <select
                    className="form-select"
                    value={pickupSlot}
                    onChange={e => setPickupSlot(e.target.value)}
                  >
                    <option value="in_20_min">In 20 minutes</option>
                    <option value="in_40_min">In 40 minutes</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Payment</h5>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="payUpi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                />
                <label className="form-check-label" htmlFor="payUpi">
                  UPI (mock)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="payCard"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <label className="form-check-label" htmlFor="payCard">
                  Card (mock)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="payCod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <label className="form-check-label" htmlFor="payCod">
                  Cash on Delivery
                </label>
              </div>
              <p className="text-muted small mt-2">
                All payments are mocked in this environment. No real money will be charged.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card position-sticky" style={{ top: '80px' }}>
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>

              {cart.map(item => (
                <div key={item.id} className="d-flex justify-content-between mb-2">
                  <div>
                    <strong>{item.name}</strong>
                    <div className="small text-muted">x{item.quantity}</div>
                  </div>
                  <div>₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}

              <hr />
              <div className="d-flex justify-content-between mb-1">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Tax (5%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="d-flex justify-content-between mb-1">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-1 text-success">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between mb-3 fw-bold">
                <span>Total Payable</span>
                <span>₹{finalAmount.toFixed(2)}</span>
              </div>

              <div className="input-group mb-3">
                <input
                  className="form-control"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              </div>

              <button
                className="btn btn-primary w-100"
                disabled={loading || cart.length === 0}
                onClick={handlePlaceOrder}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
              <p className="small text-muted mt-2 mb-0">
                By placing your order, you agree to Kube Café’s terms & conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

