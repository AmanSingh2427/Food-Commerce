import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import StarRating from './StarRating';
import Body from './Body';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState(9);
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const [averageRatings, setAverageRatings] = useState({});
  const [isLoadingRatings, setIsLoadingRatings] = useState(true);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
        setFilteredProducts(response.data.slice(0, visibleProducts));
        fetchAverageRatings(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [visibleProducts]);

  const fetchAverageRatings = async (products) => {
    try {
      const promises = products.map(async (product) => {
        const response = await axios.get(`http://localhost:5000/product-rating/${product.id}`);
        return {
          productId: product.id,
          averageRating: response.data.average_rating,
          ratingCount: response.data.rating_count,
        };
      });

      const results = await Promise.all(promises);
      const averageRatingsMap = results.reduce((acc, curr) => {
        acc[curr.productId] = {
          averageRating: curr.averageRating,
          ratingCount: curr.ratingCount,
        };
        return acc;
      }, {});

      setAverageRatings(averageRatingsMap);
      setIsLoadingRatings(false);
    } catch (error) {
      console.error('Error fetching average ratings:', error);
      setIsLoadingRatings(false);
    }
  };

  const handleAddToCart = async (productId, productName) => {
    try {
      const response = await axios.post('http://localhost:5000/add-to-cart', {
        userId,
        productId,
        quantity: 1 // Assuming each product adds 1 quantity by default
      });
      console.log('Product added to cart:', response.data);
      setCartCount(prevCount => prevCount + 1);
      setCartMessage(`${productName} has been added to your cart.`);
      setTimeout(() => {
        setCartMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error adding product to cart:', err);
    }
  };
  

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisible => prevVisible + 9);
  };

  const showLessProducts = () => {
    setVisibleProducts(9);
  };

  return (
    <>
      <Navbar setFilteredProducts={setFilteredProducts} cartCount={cartCount} setCartCount={setCartCount} />
      <Body />
      <div className="flex flex-col items-center bg-gray-100 py-8 min-h-screen">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">User Home Page</h2>
          <p className="text-gray-700">Welcome, {username}!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6 w-full max-w-md transition duration-300 transform hover:scale-105">
              <img
                src={`http://localhost:5000/uploads/${product.photo}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <span className="text-gray-900 font-bold mb-2">${product.price}</span>
              {isLoadingRatings ? (
                <p>Loading...</p>
              ) : (
                <div className="flex items-center mt-2">
                  <StarRating
                    rating={averageRatings[product.id] ? averageRatings[product.id].averageRating : 0}
                    disabled
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    ({averageRatings[product.id] ? averageRatings[product.id].averageRating.toFixed(1) : 0} avg)
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleAddToCart(product.id, product.name)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
            </div>
          ))}
        </div>
        {cartMessage && (
          <div className="fixed bottom-10 right-4 bg-green-500 text-white p-4 rounded-md shadow-md">
            {cartMessage}
          </div>
        )}
        {visibleProducts < products.length ? (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMoreProducts}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md mr-2 hover:bg-blue-600 transition-colors"
            >
              Load More
            </button>
            <button
              onClick={showLessProducts}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-colors"
            >
              Show Less
            </button>
          </div>
        ) : (
          visibleProducts > 9 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={showLessProducts}
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-colors"
              >
                Show Less
              </button>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Products;
