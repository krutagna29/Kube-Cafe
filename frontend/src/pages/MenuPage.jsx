import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './MenuPage.css';

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showToast, setShowToast] = useState(false);

  const { addToCart, cart } = useCart();

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const categoriesResponse = await fetch('http://localhost:5000/api/menu/categories');
      const catData = await categoriesResponse.json();
      // Handle new standardized response format
      const categoriesData = catData.success ? catData.data : catData;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      const itemsResponse = await fetch('http://localhost:5000/api/menu');
      const itemData = await itemsResponse.json();
      // Handle new standardized response format
      const itemsData = itemData.success ? itemData.data : itemData;
      setMenuItems(Array.isArray(itemsData) ? itemsData : []);

      const categories = Array.isArray(categoriesData) ? categoriesData : [];
      if (categories.length > 0) {
        setActiveCategory(categories[0].id);
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

  const filteredItems = useMemo(() => {
    if (!Array.isArray(menuItems)) return [];
    return menuItems
      .filter(item => item.category_id === activeCategory)
      .filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (priceRange.min === '' || item.price >= parseFloat(priceRange.min)) &&
        (priceRange.max === '' || item.price <= parseFloat(priceRange.max))
      );
  }, [menuItems, activeCategory, searchQuery, priceRange]);

  const handleAddToCart = (item) => {
    addToCart(item);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-5 text-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <section id="menu" className="menu-section py-5">
      <div className="container">
        {/* Cart Count */}
        <div className="cart-indicator position-fixed top-0 end-0 m-3 bg-white rounded-pill px-3 py-1 shadow-sm">
          🛒 {cart.length} items
        </div>

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
              className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Search & Filter Inputs */}
        <div className="row mb-4 justify-content-center">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by item name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Min price"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            />
          </div>
          <div className="col-md-2 mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Max price"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            />
          </div>
        </div>

        {/* Menu Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
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
                  {/* Add to Cart Icon Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn-add-to-cart-icon"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={20} />
                  </button>
                  
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
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show align-items-center text-white bg-success border-0">
            <div className="d-flex">
              <div className="toast-body">Item added to cart!</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
