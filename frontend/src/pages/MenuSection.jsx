import React, { useState, useEffect } from 'react';
import './MenuSection.css';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function MenuSection() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  const handleWhatsAppOrder = (item) => {
    const phoneNumber = '1234567890'; // Replace with actual WhatsApp number
    const message = encodeURIComponent(
      `Hi! I'd like to order:\n${item.name} x1 - ₹${item.price}\n\nTotal: ₹${item.price}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleWhatsAppCart = () => {
    if (cart.length === 0) return;
    const phoneNumber = '1234567890';
    const orderText = cart.map(item => 
      `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = encodeURIComponent(
      `Hi! I'd like to order:\n\n${orderText}\n\nTotal: ₹${total.toFixed(2)}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setCart([]);
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const catRes = await fetch('http://localhost:5000/api/menu/categories');
      const catData = await catRes.json();
      // Handle new standardized response format
      const categoriesData = catData.success ? catData.data : catData;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      const itemRes = await fetch('http://localhost:5000/api/menu');
      const itemData = await itemRes.json();
      // Handle new standardized response format
      const itemsData = itemData.success ? itemData.data : itemData;
      setMenuItems(Array.isArray(itemsData) ? itemsData : []);

      const categories = Array.isArray(categoriesData) ? categoriesData : [];
      if (categories.length > 0) {
        setActiveTab(categories[0].id); // Default first category
      }
    } catch (err) {
      console.error('Error fetching menu data:', err);
      setError('Failed to load menu. Please try again later.');
      setMenuItems([]); // Ensure menuItems is always an array
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5 text-danger">
        {error}
      </div>
    );
  }

  const filteredItems = Array.isArray(menuItems) ? menuItems.filter(item => item.category_id === activeTab) : [];

  return (
    <section id="menu" className="menu-section py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="menu-title mb-3">Our Menu</h2>
          <div className="menu-divider mx-auto mb-3"></div>
          <p className="menu-description">
            Crafted with passion — from rich coffees to refreshing drinks and delicious bites.
          </p>
        </div>

        {/* Category Tabs - Café Style */}
        <div className="category-pills mb-5 d-flex flex-wrap justify-content-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-pill ${activeTab === category.id ? 'active' : ''}`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="menu-grid"
          >
            {filteredItems.length === 0 ? (
              <div className="text-center text-muted py-5">
                <p className="fs-5">No items found in this category.</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div className="menu-item-card" key={item.id}>
                  <div className="menu-item-image-wrapper">
                    <img
                      src={
                        item.image_url
                          ? `http://localhost:5000/uploads/${item.image_url.replace(/^uploads[\\/]/, '')}`
                          : '/images/placeholder.png'
                      }
                      className="menu-item-image"
                      alt={item.name}
                    />
                    <div className="menu-item-overlay">
                      <button
                        onClick={() => handleWhatsAppOrder(item)}
                        className="btn-order-overlay"
                      >
                        <MessageCircle size={20} className="me-2" />
                        Order Now
                      </button>
                    </div>
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <h5 className="menu-item-name">{item.name}</h5>
                      <span className="veg-badge">🟢 Veg</span>
                    </div>
                    <p className="menu-item-description">{item.description || 'Delicious item from our kitchen'}</p>
                    <div className="menu-item-footer">
                      <span className="menu-item-price">₹{item.price}</span>
                      <button
                        onClick={() => handleWhatsAppOrder(item)}
                        className="btn-order"
                      >
                        <MessageCircle size={18} />
                        Order
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Cart Summary & WhatsApp Order Button */}
        {cart.length > 0 && (
          <div className="fixed-bottom bg-white shadow-lg p-3 border-top">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex gap-2 flex-wrap">
                    {cart.map(item => (
                      <span key={item.id} className="badge bg-secondary">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2">
                    <strong>Total: ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</strong>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <button
                    onClick={handleWhatsAppCart}
                    className="btn btn-success btn-lg w-100"
                  >
                    <MessageCircle size={20} className="me-2" />
                    Order on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
