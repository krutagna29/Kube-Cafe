import React from 'react';
import { useCart } from '../context/CartContext';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Cart({ isOpen, onClose }) {
    const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            alert('Please login to checkout');
            return;
        }
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        onClose();
        navigate('/checkout');
    };

    if (!isOpen) return null;

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-container" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="mb-0">
                        <ShoppingCart size={20} className="me-2" />
                        Your Cart ({cart.length} items)
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close"
                    />
                </div>

                <div className="cart-body p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {cart.length === 0 ? (
                        <div className="text-center py-4">
                            <ShoppingCart size={48} className="text-muted mb-3" />
                            <p className="text-muted">Your cart is empty</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="cart-item d-flex align-items-center mb-3 p-2 border rounded">
                                <div className="flex-grow-1">
                                    <h6 className="mb-1">{item.name}</h6>
                                    <p className="text-muted mb-1 small">{item.description}</p>
                                    <p className="mb-0 fw-bold">₹{Number(item.price).toFixed(2)}</p>

                                </div>
                                
                                <div className="d-flex align-items-center me-3">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="mx-2 fw-bold">{item.quantity}</span>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer p-3 border-top">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">Total:</h6>
                            <h6 className="mb-0 fw-bold">₹{total.toFixed(2)}</h6>
                        </div>
                        
                        <div className="d-grid gap-2">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleCheckout}
                                disabled={!user}
                            >
                                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                            </button>
                            
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 