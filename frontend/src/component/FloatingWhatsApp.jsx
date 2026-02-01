import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import './FloatingWhatsApp.css';

export default function FloatingWhatsApp() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');

  const phoneNumber = '1234567890'; // Replace with actual WhatsApp number

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    setMessage('');
    setIsExpanded(false);
  };

  const handleQuickOrder = () => {
    const quickMessage = encodeURIComponent("Hi! I'd like to place an order.");
    window.open(`https://wa.me/${phoneNumber}?text=${quickMessage}`, '_blank');
    setIsExpanded(false);
  };

  return (
    <div className="floating-whatsapp position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1050 }}>
      {isExpanded ? (
        <div className="card shadow-lg" style={{ width: '320px', maxWidth: '90vw' }}>
          <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <MessageCircle size={20} />
              <strong>Chat with Us</strong>
            </div>
            <button
              className="btn btn-sm btn-link text-white p-0"
              onClick={() => setIsExpanded(false)}
            >
              <X size={20} />
            </button>
          </div>
          <div className="card-body">
            <p className="small mb-3">Send us a message or place an order!</p>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2">
              <button
                onClick={handleSendMessage}
                className="btn btn-success flex-grow-1"
                disabled={!message.trim()}
              >
                Send
              </button>
              <button
                onClick={handleQuickOrder}
                className="btn btn-outline-success"
              >
                Quick Order
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-success rounded-circle p-3 shadow-lg"
          style={{ width: '60px', height: '60px' }}
          onClick={() => setIsExpanded(true)}
          aria-label="Open WhatsApp chat"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}

