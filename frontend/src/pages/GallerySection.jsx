import React from 'react';
import Masonry from '../component/Masonary'; // Make sure this is in the correct relative path

import image1 from '../assets/g3.jpg'
import image2 from '../assets/galary3.jpg'
import image3 from '../assets/galary8.jpg'
import image4 from '../assets/galary7.jpg'
import image5 from '../assets/galary 9.jpg'
import image6 from '../assets/galary5.jpg'
export default function GallerySection() {
  const items = [
    {      id: "1",      img: image1,      url: "https://example.com/one",      height: 300,    },
    {      id: "2",      img: image2,      url: "https://example.com/two",      height: 500,    },
    {      id: "3",      img: image4,      url: "https://example.com/three",      height: 600,    },
    {      id: "4",      img: image3,      url: "https://example.com/four",      height: 500,    },
    {      id: "5",      img: image5,      url: "https://example.com/five",      height: 300,    },
    // {      id: "6",      img: image6,      url: "https://example.com/five",      height: 500,    },
  ];

  return (
    <section id="gallery" className="py-5  text-center">
      <div className="container">
        <h2 className="display-5 fw-bold text-coffee mb-3">A Glimpse of Our Cafe</h2>
        <p className="text-muted mb-4">
          Moments captured at Kube Cafe. The ambiance, the food, the community.
        </p>
        <Masonry
          items={items}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
        />
      </div>
    </section>
  );
}
