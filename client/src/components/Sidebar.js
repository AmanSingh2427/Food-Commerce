import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';

const Sidebar = ({ toggleTableDisplay, setFilteredProducts }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userImage');
    window.location.href = '/login';
  };

  const handleOrderRequestsClick = () => {
    // Handle order requests click logic
  };

  const handleCategoryClick = async (category) => {
    // Handle category click logic
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    // Handle search input change logic
  };

  return (
    <div className="bg-gray-800 w-64 h-screen text-white fixed top-0 left-0 overflow-y-auto">
      <div className="p-4">
        {/* Sidebar Header */}
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      {/* Sidebar Content */}
      <div className="space-y-4">
        <Link to="/home" className="block p-3 hover:bg-gray-700">Home</Link>
        <Link to="/about" className="block p-3 hover:bg-gray-700">About</Link>
        <Link to="/contact" className="block p-3 hover:bg-gray-700">Contact</Link>
        <Link to="/products" className="block p-3 hover:bg-gray-700">Our Products</Link>
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Search by category"
            className="p-3 rounded w-full"
          />
          {/* Categories Dropdown */}
          {/* Implement categories dropdown here similar to Navbar */}
        </div>
        {/* Notification Bell and Dropdown */}
        {/* Implement notification bell and dropdown similar to Navbar */}
        <button
          onClick={handleOrderRequestsClick}
          className="block p-3 hover:bg-gray-700 text-green-400"
        >
          Order Requests
        </button>
        <button
          onClick={handleLogout}
          className="block p-3 hover:bg-gray-700 text-red-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
