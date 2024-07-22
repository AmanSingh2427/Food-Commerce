import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
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
        setImage(response.data.image);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let errors = {};
    if (!fullName) errors.fullName = 'Full Name is required';
    if (!email) errors.email = 'Email is required';
    if (!username) errors.username = 'Username is required';

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
      return;
    }

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
      toast.success('Profile Updated Successfully!', {
        onClose: () => navigate('/adminhome')
      });
    } catch (error) {
      toast.error(`Error updating profile: ${error.response.data.message}`);
    }
  };

  return (
    <>
      <NavbarAdmin/>
      <ToastContainer />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Full Name" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              className="mb-4 p-2 w-full border rounded"
            />
            {validationErrors.fullName && <p className="text-red-500">{validationErrors.fullName}</p>}
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="mb-4 p-2 w-full border rounded"
            />
            {validationErrors.email && <p className="text-red-500">{validationErrors.email}</p>}
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="mb-4 p-2 w-full border rounded"
            />
            {validationErrors.username && <p className="text-red-500">{validationErrors.username}</p>}
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
    </>
  );
};

export default UpdateProfile;
