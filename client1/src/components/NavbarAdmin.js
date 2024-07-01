import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import reactLogo from '../images/image2.png'; // Update this path with the actual path to your logo

const NavbarAdmin = () => {
  const username = localStorage.getItem('username');
  const userImage = localStorage.getItem('userImage');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pending-registrations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPendingUsers(response.data);
      } catch (err) {
        console.error('Error fetching pending users:', err);
      }
    };
    fetchPendingUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userImage');
    window.location.href = '/login';
  };

  const handleBellClick = () => {
    navigate('/user-requests');
  };

  return (
    <nav className="bg-gray-800 p-4 w-full">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="p-1">
            <img
              src={reactLogo}
              className="h-12 w-auto cursor-pointer"
              alt="React logo"
              onClick={() => navigate('/adminhome')}
            />
          </div>
        </div>
        <div className="flex space-x-4 items-center">
          {username ? (
            <>
              <img
                src={userImage ? `http://localhost:5000/${userImage}` : "default-image-url"}
                alt="User profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white">{username}</span>
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className="relative">
                  <FaBell className="text-white" onClick={handleBellClick} />
                  {pendingUsers.length > 0 && (
                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                  )}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                    <ul>
                      {pendingUsers.length > 0 ? (
                        pendingUsers.map(user => (
                          <li key={user.id} className="p-2 border-b hover:bg-gray-100">
                            <p className="text-sm font-medium">{user.username}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </li>
                        ))
                      ) : (
                        <li className="p-2 text-gray-600 text-sm">No pending registrations</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-700 transition-colors w-auto"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
