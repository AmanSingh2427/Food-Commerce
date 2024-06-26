import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const username = localStorage.getItem('username');
  const userImage = localStorage.getItem('userImage');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/cart/${userId}`);
        setCartCount(response.data.length);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    if (userId) {
      fetchCartCount();
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userImage');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/home" className="text-white">Home</Link>
          <Link to="/about" className="text-white">About</Link>
          <Link to="/contact" className="text-white">Contact</Link>
        </div>
        <div className="flex space-x-4 items-center">
          {username ? (
            <>
              <Link to="/update-profile" className="text-blue-400 hover:text-blue-700 transition-colors">Update Profile</Link>
              <img 
                src={userImage ? `http://localhost:5000/${userImage}` : "default-image-url"} 
                alt="User profile" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white">{username}</span>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
              <Link to="/cart" className="relative">
                <FaShoppingCart className="text-white text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{cartCount}</span>
                )}
              </Link>
            </>
          ) : (
            <Link to="/login" className="text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
