import { useState, useEffect } from 'react';

function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { image: 'https://via.placeholder.com/1200x400?text=Offer+1', text: '50% Off Electronics!' },
    { image: 'https://via.placeholder.com/1200x400?text=Offer+2', text: 'Buy 1 Get 1 Free!' },
    { image: 'https://via.placeholder.com/1200x400?text=Offer+3', text: 'Free Shipping on Orders!' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Generate particles
  const particles = Array.from({ length: 20 }).map((_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        width: `${Math.random() * 10 + 5}px`,
        height: `${Math.random() * 10 + 5}px`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
      }}
    />
  ));

  return (
    <div className="hero">
      <div className="particles">{particles}</div>
      <div className="slideshow">
        <img src={slides[currentSlide].image} alt="Slide" />
        <div className="slideshow-text">{slides[currentSlide].text}</div>
      </div>
    </div>
  );
}

export default Slideshow;