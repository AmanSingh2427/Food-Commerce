import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Dashboard';
import NavbarAdmin from './NavbarAdmin';

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    photo: '',
    description: '',
    category: '',
    discount: '' // Added discount field
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setNewProduct((prevState) => ({
      ...prevState,
      photo: e.target.files[0]
    }));
  };

  const validateForm = () => {
    const fields = ['name', 'price', 'photo', 'description', 'category', 'discount'];
    for (const field of fields) {
      if (!newProduct[field]) {
        return `Please fill in the ${field} field.`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationMessage = validateForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('photo', newProduct.photo);
    formData.append('description', newProduct.description);
    formData.append('category', newProduct.category);
    formData.append('discount', newProduct.discount); // Append discount to formData

    try {
      await axios.post('http://localhost:5000/create-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Product created successfully!');
      setTimeout(() => {
        navigate('/adminhome'); // Navigate to admin home page on success
      }, 2000);
    } catch (err) {
      toast.error('Error creating product');
    }
  };

  return (
    <>
      <Dashboard />
      <NavbarAdmin />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
            <h2 className="block text-gray-700 text-lg font-bold mb-6 text-center">Create New Product</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                Photo
              </label>
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category
              </label>
              <select
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select a category</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Main Courses">Main Courses</option>
                <option value="Entrees">Entrees</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
                <option value="Specialty Items">Specialty Items</option>
                <option value="Kids' Menu">Kids' Menu</option>
                <option value="Seasonal Specials">Seasonal Specials</option>
                <option value="Healthy Options">Healthy Options</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discount">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={newProduct.discount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
            >
              Create Product
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateProductForm;
