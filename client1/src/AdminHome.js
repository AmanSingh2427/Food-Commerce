import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import NavbarAdmin from './components/NavbarAdmin';
import bgImage from './images/image1.jpg'; // Update this path with the actual path to your background image

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavbarAdmin />
      <div className="flex flex-col flex-grow ">
        <div className="relative flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4 ">
          <div
            className="absolute inset-0 bg-cover bg-center z-0 w-full h-full"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="relative bg-white p-8 rounded shadow-md max-w-4xl mx-auto bg-opacity-70 backdrop-blur-md z-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Admin Home Page</h2>
            <div className="mb-6 text-center">Welcome, {localStorage.getItem('username')}!</div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => navigate('/create-product')}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Create New Product
              </button>
              <Link
                to="/products"
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors"
              >
                Update Product
              </Link>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                navigate('/login');
              }}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors mt-6"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
