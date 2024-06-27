import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './components/NavbarAdmin';
import { Link, useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [showTable, setShowTable] = useState(false);
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

  return (
    <>
      <div>
        <NavbarAdmin toggleTableDisplay={() => setShowTable(!showTable)} />
      </div>

      {showTable && (
        <div className="overflow-x-auto">
          {/* Table display code */}
        </div>
      )}

      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Home Page</h2>
          <div className="mb-6 text-center">Welcome, {localStorage.getItem('username')}!</div>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/create-product')}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Create New Product
            </button>
            <Link to="/products" className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors">
              Update Product
            </Link>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('username');
              window.location.href = '/login';
            }}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors mt-6"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
