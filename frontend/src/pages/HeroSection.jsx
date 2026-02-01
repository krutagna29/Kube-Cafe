import React, { useState, useEffect } from 'react';
import './HeroSection.css';
import bghome from '../assets/bghome.jpg';
import { Clock, MapPin, Phone, MessageCircle } from 'lucide-react';

export default function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Opening hours: 7 AM - 10 PM
  const openingHour = 7;
  const closingHour = 22;

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      setCurrentTime(now);
      const currentHour = now.getHours();
      setIsOpen(currentHour >= openingHour && currentHour < closingHour);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppOrder = () => {
    const phoneNumber = '1234567890'; // Replace with actual WhatsApp number
    const message = encodeURIComponent("Hi! I'd like to place an order.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+1234567890'; // Replace with actual phone number
  };

  return (
    <section className="hero-section d-flex align-items-center text-center text-white position-relative overflow-hidden">
      {/* Background Overlay */}
      <div className="overlay position-absolute w-100 h-100"></div>

      {/* Background Image */}
      <img src={bghome}
        alt="Kube Cafe Crafter interior"
        className="hero-bg position-absolute w-100 h-100 object-fit-cover"
      />

      {/* Content */}
      <div className="container position-relative z-2">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Open/Closed Status */}
            <div className="mb-3">
              <span className={`badge ${isOpen ? 'bg-success' : 'bg-danger'} px-3 py-2 fs-6`}>
                {isOpen ? '🟢 Open Now' : '🔴 Closed'}
              </span>
            </div>

            <h1 className="display-3 fw-bold hero-title">Kube Cafe</h1>
            <p className="lead text-light mt-3">
              Where craftsmanship meets coffee. A unique space to unwind, work, and savor artisanal brews and bites.
            </p>

            {/* Today's Offer / Bestseller */}
            <div className="mt-4 mb-4">
              <div className="today-offer bg-warning bg-opacity-25 rounded p-3 d-inline-block">
                <strong className="text-warning">🔥 Today's Special:</strong>
                <span className="ms-2">Cappuccino + Croissant Combo - 20% Off!</span>
              </div>
            </div>



          </div>
        </div>
      </div>
    </section>
  );
}
