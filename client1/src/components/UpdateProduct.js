import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Dashboard from './Dashboard';
import NavbarAdmin from './NavbarAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || {
    id: '',
    name: '',
    price: '',
    description: '',
    category: '',
    photo: '',
    discount: ''
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!location.state?.product) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/products/${productId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setProduct(response.data);
        } catch (err) {
          console.error('Error fetching product:', err);
        }
      };
      fetchProduct();
    }
  }, [productId, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Manual validation for required fields
    if (!product.name) {
      toast.error('Please fill in the product name');
      return;
    }
    if (!product.price) {
      toast.error('Please fill in the product price');
      return;
    }
    if (!product.description) {
      toast.error('Please fill in the product description');
      return;
    }
    if (!product.category) {
      toast.error('Please select a category');
      return;
    }
    if (!product.discount) {
      toast.error('Please fill in the discount percentage');
      return;
    }

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('category', product.category);
    formData.append('discount', product.discount);
    if (image) {
      formData.append('photo', image);
    }

    try {
      await axios.put(`http://localhost:5000/products/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(`Product ${product.name} updated successfully!`);
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Error updating product. Please try again.');
    }
  };

  return (
    <>
      <Dashboard />
      <NavbarAdmin />
      <div className="container mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Product</h2>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Enter product name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Enter product price"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Enter product description"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
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
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%):</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={product.discount}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Enter discount percentage"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo:</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
          >
            Update
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default UpdateProduct;
