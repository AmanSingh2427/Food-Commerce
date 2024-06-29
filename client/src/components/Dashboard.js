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

const Sidebar = () => {

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
    <div className="bg-gray-100 text-dark h-screen w-64 fixed top-0 left-0 overflow-y-auto">
      <div className="p-4">
        <img src={reactLogo} className="h-24 w-auto" alt="React logo" onClick={handleImageClick} />
      </div>

      <ul className="p-2">

        <li className="py-2 px-4 hover:bg-gray-300 relative">
          <a href="adminhome" className="block flex items-center justify-between">
            <div className="flex items-center"> {/* Added flex container for icon and text */}
              <RiComputerLine className="mr-2" />
               {/* Added margin-right to create space between icon and text */}
             Home
            </div>
            {/* <BsChevronDown className="ml-2" /> */}
          </a>
          {/* Dropdown menu */}
          
        </li>
        {/* Add other sidebar items here */}

        <li className="py-2 px-4 hover:bg-gray-300 relative">
          <a href="/create-product" className="block flex items-center justify-between">
            <div className="flex items-center"> {/* Added flex container for icon and text */}
              <RiMastercardLine className="mr-2" /> {/* Added margin-right to create space between icon and text */}
              Create New Product
            </div>
            {/* <BsChevronDown className="ml-2" /> */}
          </a>
          {/* Dropdown menu */}
        </li>

        <li className="py-2 px-4 hover:bg-gray-300 relative">
          <a href="/products" className="block flex items-center justify-between">
            <div className="flex items-center"> {/* Added flex container for icon and text */}
              <BsCalendarEventFill className="mr-2" /> {/* Added margin-right to create space between icon and text */}
              Update Product
            </div>
          </a>
          {/* Dropdown menu */}
        </li>


        <li className="py-2 px-4 hover:bg-gray-300 relative">
          <a href="/products" className="block flex items-center justify-between">
            <div className="flex items-center"> {/* Added flex container for icon and text */}
              <IoDocumentSharp className="mr-2" /> {/* Added margin-right to create space between icon and text */}
              Our Products
            </div>           
          </a>
        </li>

        <li className="py-2 px-4 hover:bg-gray-300 relative">
          <a href="/order-request" className="block flex items-center justify-between">
            <div className="flex items-center"> {/* Added flex container for icon and text */}
              <FaShoppingCart className="mr-2" /> {/* Added margin-right to create space between icon and text */}
            
              Order Request
            </div>
    
          </a>
        </li>

        <li className="py-2 px-4 hover:bg-gray-300 relative">
          <a href="/update-profile" className="block flex items-center justify-between">
            <div className="flex items-center"> {/* Added flex container for icon and text */}
              <IoDocumentsSharp className="mr-2" /> {/* Added margin-right to create space between icon and text */}
              Update Profile
            </div>
            {/* <BsChevronDown className="ml-2" /> */}
          </a>
        </li>

        <li className="py-2 px-4 hover:bg-gray-300 relative">
          <a href="#" className="block flex items-center justify-between">
            <div className="flex items-center"> {/* Added flex container for icon and text */}
              <FaUserCircle className="mr-2" /> {/* Added margin-right to create space between icon and text */}
              {/* Logout */}
              <div
                onClick={handleLogout}
                className="text-dark-400 hover:text-red-700 transition-colors"
              >
                Logout
              </div>
            </div>
            {/* <BsChevronDown className="ml-2" /> */}
          </a>
        </li>

        <li className="py-2 px-4 hover:bg-gray-300 relative">
          <a href="#" className="block flex items-center justify-between">
            <div className="flex items-center"> {/* Added flex container for icon and text */}
              <FaUpload className="mr-2" /> {/* Added margin-right to create space between icon and text */}
              Doc Upload
              
            </div>
            
            <BsChevronDown className="ml-2" />
          </a>
        </li>

        

        <li className="py-2 px-4 hover:bg-gray-300 relative">
          <a href="#" className="block flex items-center justify-between">
            <div className="flex items-center"> {/* Added flex container for icon and text */}
              <FaArrowUp className="mr-2" /> {/* Added margin-right to create space between icon and text */}
              Stock
            </div>
            <BsChevronDown className="ml-2" />
          </a>
        </li>

        <li className="py-2 px-4 hover:bg-gray-300 relative">
          <a href="#" className="block flex items-center justify-between">
            <div className="flex items-center"> {/* Added flex container for icon and text */}
              <FaStar className="mr-2" /> {/* Added margin-right to create space between icon and text */}
              Quality
            </div>
            <BsChevronDown className="ml-2" />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
