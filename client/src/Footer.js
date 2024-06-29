import React from 'react';
import logo from './images/image2.png'; // Adjust the path as needed

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Company Logo" className="h-16 w-32" /> {/* Adjust height as needed */}
          <p>&copy; {new Date().getFullYear()} Zomato. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="/about" className="hover:text-gray-400">About</a>
          <a href="/contact" className="hover:text-gray-400">Contact</a>
          <a href="/home" className="hover:text-gray-400">Privacy Policy</a>
          <a href="/home" className="hover:text-gray-400">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
