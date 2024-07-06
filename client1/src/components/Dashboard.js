import React from 'react';
import { BsChevronDown } from "react-icons/bs";
import reactLogo from '../images/image2.png'
import { RiComputerLine } from "react-icons/ri";
import { RiMastercardLine } from "react-icons/ri";
import { BsCalendarEventFill } from "react-icons/bs";
import { IoDocumentSharp } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { IoDocumentsSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userImage');
    window.location.href = '/login';
  };

  const handleImageClick = () => {
    navigate('/adminhome');
  };

  return (
    <div className="bg-gray-100 text-dark min-h-screen w-64 fixed top-0 left-0 overflow-y-auto">
      <div className="p-4">
        <img src={reactLogo} className="h-24 w-auto cursor-pointer" alt="React logo" onClick={handleImageClick} />
      </div>

      <ul className="p-2">
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/adminhome" className="block flex items-center">
            <RiComputerLine className="mr-2" />
            Home
          </Link>
        </li>
        {/* Add other Dashboard items here */}
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/create-product" className="block flex items-center">
            <RiMastercardLine className="mr-2" />
            Create New Product
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/products" className="block flex items-center">
            <BsCalendarEventFill className="mr-2" />
            Update Product
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/products" className="block flex items-center">
            <IoDocumentSharp className="mr-2" />
            Our Products
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/order-request" className="block flex items-center">
            <FaShoppingCart className="mr-2" />
            Order Request
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/updateadmin-profile" className="block flex items-center">
            <IoDocumentsSharp className="mr-2" />
            Update Profile
          </Link>
        </li>
       
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/user-requests" className="block flex items-center">
            <FaUpload className="mr-2" />
            New User Request
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/download-pdf" className="block flex items-center">
            <FaArrowUp className="mr-2" />
            Download Pdf
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/user-message" className="block flex items-center">
            <FaStar className="mr-2" />
            User's Messages
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <div className="block flex items-center cursor-pointer" onClick={handleLogout}>
            <FaUserCircle className="mr-2" />
            Logout
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard;
