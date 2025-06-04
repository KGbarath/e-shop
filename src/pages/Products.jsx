import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  const mockProducts = [
    { _id: 'mock1', name: 'Smartphone', price: 699, images: ['https://www.androidheadlines.com/wp-content/uploads/2023/11/Apple-iPhone-16-Pro-Max-Technizo-Concept-image-1-jpg.webp'], category: 'Electronics', rating: 4.5 },
    { _id: 'mock2', name: 'Laptop', price: 1299, images: ['https://cdn.thewirecutter.com/wp-content/media/2024/11/cheapgaminglaptops-2048px-7981.jpg'], category: 'Electronics', rating: 4.8 },
    { _id: 'mock3', name: 'T-Shirt', price: 29, images: ['https://cdn.dsmcdn.com/ty1678/prod/PLM/20250516/2018925/2023910/2034877/3a29c090-a7ea-48ae-bf5b-ccde742d5268/0_org_zoom.jpg'], category: 'Clothing', rating: 4.2 },
    { _id: 'mock4', name: 'Jeans', price: 59, images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTam80sCmMGTOTl83qeVHLV7gaIImnT07EaSV9cUwQjjuIBxis31Gt6Ndjyu_fHw-EartM&usqp=CAU'], category: 'Clothing', rating: 4.0 },
    { _id: 'mock5', name: 'Book: Sci-Fi', price: 19, images: ['https://m.media-amazon.com/images/I/41aqZYu1ZaL._AC_UF1000,1000_QL80_.jpg'], category: 'Books', rating: 4.7 },
    { _id: 'mock6', name: 'Book: Fantasy', price: 24, images: ['https://realmofreads.com/wp-content/uploads/2024/09/best-fantasy-books-on-kindle-unlimited-feature-image.jpg'], category: 'Books', rating: 4.9 },
    { _id: 'mock7', name: 'Headphones', price: 99, images: ['https://m.media-amazon.com/images/I/61E3hfy84gL._AC_UF350,350_QL80_.jpg'], category: 'Electronics', rating: 4.3 },
    { _id: 'mock8', name: 'Tablet', price: 499, images: ['https://m.media-amazon.com/images/I/618Acjb5AhL._AC_UF1000,1000_QL80_.jpg'], category: 'Electronics', rating: 4.6 },
    { _id: 'mock9', name: 'Jacket', price: 89, images: ['https://m.media-amazon.com/images/I/71mbKWAq8-L._AC_UY1000_.jpg'], category: 'Clothing', rating: 4.1 },
    { _id: 'mock10', name: 'Sneakers', price: 69, images: ['https://redtape.com/cdn/shop/files/RSL0303_1.jpg?v=1748078205'], category: 'Clothing', rating: 4.4 },
    { _id: 'mock11', name: 'Book: Mystery', price: 22, images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Y0f1Pl5Hk8M6yvClofxx3cOFCxxY5_T22Q&s'], category: 'Books', rating: 4.5 },
    { _id: 'mock12', name: 'Book: Romance', price: 18, images: ['https://hips.hearstapps.com/hmg-prod/images/sam-1663176590.jpeg?crop=1xw:0.9709690074539035xh;center,top&resize=980:*'], category: 'Books', rating: 4.2 },
    { _id: 'mock13', name: 'Lamp', price: 45, images: ['https://m.media-amazon.com/images/I/71jIfDWFmEL.jpg'], category: 'Home', rating: 4.0 },
    { _id: 'mock14', name: 'Chair', price: 120, images: ['https://dukaan.b-cdn.net/700x700/webp/upload_file_service/047934db-feb3-4606-bda1-a4015e92c3f0/room-fabric-sofa-single-chair-high-back-chair.webp'], category: 'Home', rating: 4.3 },
    { _id: 'mock15', name: 'Teddy Bear', price: 25, images: ['https://i.pinimg.com/564x/6f/96/27/6f9627155193442f58405e8939814adc.jpg'], category: 'Toys', rating: 4.6 },
    { _id: 'mock16', name: 'Puzzle', price: 15, images: ['https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/cd/02/e4/cd02e49b-147f-374e-0730-c8defc80e228/84b36acf-0192-486d-8c47-929e6e4cf35a_ipad_English__U0028U.S._U0029_04.jpg/643x0w.jpg'], category: 'Toys', rating: 4.2 },
    { _id: 'mock17', name: 'Smartwatch', price: 199, images: ['https://cdn.shopify.com/s/files/1/0356/9850/7909/files/zeb-Gemini-banner8.jpg?v=1697106712'], category: 'Electronics', rating: 4.7 },
    { _id: 'mock18', name: 'Dress', price: 49, images: ['https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?cs=srgb&dl=pexels-anne-363161-985635.jpg&fm=jpg'], category: 'Clothing', rating: 4.3 },
    { _id: 'mock19', name: 'Book: History', price: 30, images: ['https://m.media-amazon.com/images/I/51NAVbHmeSL._AC_UF1000,1000_QL80_.jpg'], category: 'Books', rating: 4.8 },
    { _id: 'mock20', name: 'Rug', price: 80, images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI_q1E1lCeypDAl9luEwYosI5EiDF-4Nu-cA&s'], category: 'Home', rating: 4.4 },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts([...res.data, ...mockProducts]);
        setFilteredProducts([...res.data, ...mockProducts]);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Showing mock data instead.');
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search')?.toLowerCase() || '';
    const categoryQuery = params.get('category') || '';

    let filtered = products;
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery)
      );
    }
    if (categoryQuery) {
      filtered = filtered.filter((product) => product.category === categoryQuery);
      setCategory(categoryQuery);
    } else {
      setCategory('');
    }
    setFilteredProducts(filtered);
  }, [location.search, products]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    const params = new URLSearchParams(location.search);
    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    setFilteredProducts(
      selectedCategory
        ? products.filter((product) => product.category === selectedCategory)
        : products
    );
  };

  return (
    <div className="container">
      <h2>Products</h2>
      <div className="category-filter">
        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
          <option value="Toys">Toys</option>
        </select>
      </div>
      {loading && <p>Loading products...<span className="loader"></span></p>}
      {error && <p style={{ color: '#ff6f61' }}>{error}</p>}
      {filteredProducts.length > 0 ? (
        <div className="product-list">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default Products;