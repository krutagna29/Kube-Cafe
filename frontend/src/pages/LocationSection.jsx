import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function LocationSection() {
  const handleGetDirections = () => {
    // Replace with actual address
    const address = encodeURIComponent('123 Coffee Lane, Silicon Valley, CA 94000');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
  };

  // Google Maps embed - Replace with your actual location coordinates
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.281343787628!2d-122.41941548459384!3d37.774929279759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1234567890";

  return (
    <section id="location" className="location-section py-5 bg-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="mb-4">📍 Find Us</h2>
            <div className="location-info">
              <div className="d-flex align-items-start mb-3">
                <MapPin size={24} className="text-primary me-3 mt-1" />
                <div>
                  <h5 className="mb-1">Address</h5>
                  <p className="mb-0">123 Coffee Lane<br />Silicon Valley, CA 94000</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-3">
                <Navigation size={24} className="text-primary me-3 mt-1" />
                <div>
                  <h5 className="mb-1">Parking & Landmarks</h5>
                  <p className="mb-0">Free parking available<br />Near the Tech Park entrance</p>
                </div>
              </div>

              <button
                onClick={handleGetDirections}
                className="btn btn-primary btn-lg mt-3 d-flex align-items-center gap-2"
              >
                <Navigation size={20} />
                Get Directions
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="map-container rounded shadow" style={{ height: '400px', overflow: 'hidden' }}>
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kube Cafe Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

