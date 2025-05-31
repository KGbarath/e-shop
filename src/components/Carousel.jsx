import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Carousel() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    {
      image: 'https://png.pngtree.com/thumb_back/fh260/background/20230706/pngtree-top-down-view-of-blue-gadgets-in-digital-agency-3d-render-image_3804599.jpg',
      text: '50% Off Electronics!',
      category: 'Electronics',
    },
    {
      image: 'https://img.freepik.com/free-photo/fast-fashion-concept-with-full-clothing-store_23-2150871345.jpg',
      text: 'Buy 1 Get 1 Free on Clothing!',
      category: 'Clothing',
    },
    {
      image: 'https://static.vecteezy.com/system/resources/thumbnails/044/280/984/small_2x/stack-of-books-on-a-brown-background-concept-for-world-book-day-photo.jpg',
      text: 'Free Shipping on Books!',
      category: 'Books',
    },
    {
      image: 'https://myindianthings.com/cdn/shop/articles/a737358e3e7c255af247e36501d3f91b_1024x.jpg?v=1648543628',
      text: '20% Off Home Decor!',
      category: 'Home',
    },
    {
      image: 'https://t4.ftcdn.net/jpg/11/77/13/41/360_F_1177134166_AddkrkrtzKQpap0Et7EXhAg7ynqAqDLp.jpg',
      text: 'Kids Toys Sale!',
      category: 'Toys',
    },
  ];

  const visibleSlides = 3; // Number of slides visible at once on desktop
  const totalSlides = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 3000); // Reduced to 3 seconds
    return () => clearInterval(interval);
  }, [totalSlides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

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
      <div className="carousel">
        <button className="carousel-arrow left" onClick={handlePrev}>❮</button>
        <div
          className="carousel-container"
          style={{
            transform: `translateX(-${(currentIndex * 100) / visibleSlides}%)`,
            width: `${(totalSlides * 100) / visibleSlides}%`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <img src={slide.image} alt={slide.text} />
              <div className="carousel-slide-content">
                <h3>{slide.text}</h3>
                <button onClick={() => navigate(`/products?category=${slide.category}`)}>
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-arrow right" onClick={handleNext}>❯</button>
      </div>
    </div>
  );
}

export default Carousel;