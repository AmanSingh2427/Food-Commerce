import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from '../Footer';
import cardImage from '../images/contact1.png'; 
import headerImage from '../images/card6.webp'; 

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    food: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Form submitted successfully!');
        setFormData({ name: '', email: '', food: '', message: '' });
      } else {
        alert('Failed to submit form.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
      <div className="relative h-screen md:h-[75vh] flex-grow">
        <img src={headerImage} alt="Header" className="absolute w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold">Welcome to Our Restaurant</h1>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-start lg:space-x-8 p-4 max-w-6xl mx-auto">
          <div className="w-full lg:w-1/2 p-4 bg-white shadow-md rounded mb-8 lg:mb-0">
            <img src={cardImage} alt="Card" className="w-full h-48 object-cover rounded mb-4" />
            <h3 className="text-xl font-bold mb-2">Welcome to Our Restaurant</h3>
            <p className="text-gray-700">
              We are committed to providing you with the best dining experience. Whether you're here for a quick bite or a full meal, we have something for everyone. Enjoy our delicious food and excellent service.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-full lg:w-1/2 p-4 bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Favorite Food</label>
              <input
                type="text"
                name="food"
                value={formData.food}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer />
      </div>
    </>
  );
};

export default ContactForm;
