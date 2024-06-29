import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import reactLogo from '../images/image2.png';

const Navbar = ({ setFilteredProducts }) => {
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const username = localStorage.getItem('username');
  const userImage = localStorage.getItem('userImage');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        const categoriesData = response.data;
        setCategories(categoriesData);
        setFilteredItems(['All Products', ...categoriesData]); // Include 'All Products' as the first option
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userImage');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  

  const handleCategoryClick = async (category) => {
    try {
      const response = await axios.get(`http://localhost:5000/products/category/${category}`);
      setFilteredProducts(response.data);
      setSearchInput(category); // Autofill search input with selected category
      setShowCategories(false); // Close categories dropdown
      setShowDropdown(false); // Close dropdown menu
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };

  const handleProductClick = (product) => {
    setFilteredProducts([product]);
    setSearchInput(product.name); // Autofill search input with selected product name
    setShowDropdown(false); // Close dropdown menu
  };

  const handleAllProductsClick = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setFilteredItems(response.data);
      setSearchInput('All Products');
      setShowDropdown(false);
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  };
  

  const handleSearchInputChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchInput(searchValue);
  
    // Filter both categories and products based on search input
    const filtered = [...categories, ...products].filter(item =>
      (item.category && item.category.toLowerCase().includes(searchValue)) ||
      (item.name && item.name.toLowerCase().includes(searchValue))
    );
    setFilteredItems(filtered);
    setShowDropdown(true); // Show dropdown on search input change
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const searchValue = searchInput.toLowerCase().trim();
      if (searchValue === 'all products') {
        handleAllProductsClick();
      } else if (filteredItems.length > 0) {
        if (searchValue === filteredItems[0].category.toLowerCase()) {
          handleCategoryClick(filteredItems[0].category);
        } else {
          handleProductClick(filteredItems[0]);
        }
      }
    }
  };

  const handleLogoClick = () => {
    navigate('/home');
  };
  

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-8">
        <img
              src={reactLogo}
              className="h-12 w-32 cursor-pointer "
              alt="React logo "
              onClick={handleLogoClick}
            />
          <Link to="/home" className="text-white py-2">Home</Link>
          <Link to="/about" className="text-white py-2">About</Link>
          <Link to="/contact" className="text-white py-2">Contact</Link>
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Search by category"
              className="px-4 py-2 rounded"
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setShowDropdown(false)}
            />
            {showDropdown && (
              <div
                className="absolute top-12 left-0 w-full bg-white rounded-md shadow-lg z-20"
              >
                <ul>
                  {filteredItems.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-200"
                      onMouseDown={() => {
                        if (item.category) {
                          handleCategoryClick(item.category);
                        } else {
                          handleProductClick(item);
                        }
                      }}
                    >
                      {item.category ? item.category : item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
