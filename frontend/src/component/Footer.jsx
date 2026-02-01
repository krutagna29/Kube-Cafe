import React from 'react';
import { Facebook, Instagram, Twitter, Coffee, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const phoneNumber = '1234567890'; // Replace with actual phone number
  const email = 'contact@kubecafe.com';
  const whatsappNumber = '1234567890'; // Replace with actual WhatsApp number

  const handleCall = () => {
    window.location.href = `tel:+${phoneNumber}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi! I'd like to know more about Kube Cafe.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <footer id='footer' className="footer-section border-top bg-dark text-white">
      <div className="container py-5">
        <div className="row">
          {/* Brand & Description */}
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-3">
              <span className="footer-brand fs-3">K<Coffee size={28} className="mx-1" />BE Cafe</span>
            </div>
            <p className="text-light">Where craftsmanship meets coffee. A unique space to unwind, work, and savor artisanal brews and bites.</p>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3">Contact Us</h5>
            <div className="contact-item d-flex align-items-start mb-3">
              <MapPin size={20} className="me-2 mt-1 text-warning" />
              <div>
                <div className="small">123 Coffee Lane</div>
                <div className="small">Silicon Valley, CA 94000</div>
              </div>
            </div>
            <div className="contact-item d-flex align-items-center mb-3">
              <Phone size={20} className="me-2 text-warning" />
              <button
                onClick={handleCall}
                className="btn btn-link text-white text-decoration-none p-0"
              >
                (123) 456-7890
              </button>
            </div>
            <div className="contact-item d-flex align-items-center mb-3">
              <Mail size={20} className="me-2 text-warning" />
              <button
                onClick={handleEmail}
                className="btn btn-link text-white text-decoration-none p-0"
              >
                {email}
              </button>
            </div>
            <div className="contact-item d-flex align-items-center">
              <MessageCircle size={20} className="me-2 text-success" />
              <button
                onClick={handleWhatsApp}
                className="btn btn-link text-white text-decoration-none p-0"
              >
                Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Social Links & Quick Links */}
          <div className="col-md-4">
            <h5 className="mb-3">Follow Us</h5>
            <div className="d-flex gap-3 mb-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook" 
                className="footer-icon"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram" 
                className="footer-icon"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter" 
                className="footer-icon"
              >
                <Twitter size={24} />
              </a>
            </div>
            <div className="quick-links">
              <h6 className="mb-2">Quick Links</h6>
              <div className="d-flex flex-column gap-2">
                <a href="#menu" className="text-white text-decoration-none small">Menu</a>
                <a href="#location" className="text-white text-decoration-none small">Location</a>
                <a href="#footer" className="text-white text-decoration-none small">Contact</a>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4 border-light" />
        <div className="text-center small text-muted">
          &copy; {new Date().getFullYear()} Kube Cafe Crafter. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
