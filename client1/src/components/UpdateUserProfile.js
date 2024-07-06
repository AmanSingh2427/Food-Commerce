import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from '../Footer';

const UpdateProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState(null);
  const [notification, setNotification] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/user-details', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsername(response.data.username);
        setEmail(response.data.email);
        setFullName(response.data.full_name);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('fullName', fullName);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('fullName', response.data.full_name);
      if (response.data.image) {
        localStorage.setItem('userImage', response.data.image);
      }
      setNotification('Profile updated successfully.');
      setTimeout(() => {
        setNotification('');
        navigate('/home');
      }, 2000);
      
    } catch (error) {
      console.error(error.response.data.message);
      setNotification('Failed to update profile.');
      setTimeout(() => {
        setNotification('');
      }, 2000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-center items-center h-screen bg-gray-100 flex-grow">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
            {notification && (
              <div className="bg-green-500 text-white p-2 rounded mb-4">
                {notification}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
                className="mb-4 p-2 w-full border rounded"
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="mb-4 p-2 w-full border rounded"
              />
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                className="mb-4 p-2 w-full border rounded"
              />
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mb-4 p-2 w-full border rounded"
              />
              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Update
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default UpdateProfile;
