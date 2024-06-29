import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard'
import Products from './components/Products';
import Body from './components/Body'
import Footer from './Footer'

const Home = () => {
  const username = localStorage.getItem('username'); // Fetch the username from localStorage

  return (
    <>
    {/* <Dashboard/> */}
    <div className=''>
    {/* <Navbar setFilteredProducts={setFilteredProducts} cartCount={cartCount} setCartCount={setCartCount} /> */}
   {/* <Body/> */}
    <Products/>
    
    </div>
    <Footer/>
    {/* <div className="flex justify-center items-center h-screen bg-gray-100 ml-80">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">User Home Page</h2>
        <p className="mb-4">Welcome, {username}!</p>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('username'); // Clear username from localStorage
            window.location.href = '/login';
          }} 
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div> */}
    </>
  );
};

export default Home;
