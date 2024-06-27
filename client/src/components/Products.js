import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId'); // Assuming you store the user ID in localStorage

  console.log(username, userId);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post('http://localhost:5000/add-to-cart', {
        userId,
        productId
      });
      console.log('Product added to cart:', response.data);
      setCartCount(cartCount + 1);
    } catch (err) {
      console.error('Error adding product to cart:', err);
    }
  };

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="flex flex-col items-center bg-gray-100 py-8 min-h-screen">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">User Home Page</h2>
          <p className="text-gray-700">Welcome, {username}!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
              <img
                src={`http://localhost:5000/uploads/${product.photo}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-lg font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <p className="text-gray-600 text-sm mb-2">Category: {product.category}</p> {/* Display category */}
              <p className="text-lg font-bold mb-2">${product.price}</p>
              <button
                onClick={() => handleAddToCart(product.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.href = '/login';
          }}
          className="bg-red-500 text-white px-4 py-2 rounded mt-8 hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Products;
