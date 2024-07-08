import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom';

const OrderRequest = () => {
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pending-orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, [notification]); // Added notification as a dependency

  const handleAcceptUserOrders = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:5000/users/${userId}/accept-orders`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setOrders(orders.filter(order => order.user_id !== userId));
        setNotification({ type: 'success', message: 'Orders accepted successfully!', color: 'green' });
        setTimeout(() => {
          setNotification(null);
        }, 2000); // Remove notification after 2 seconds
      }
    } catch (err) {
      console.error('Error accepting orders:', err);
      setNotification({ type: 'error', message: 'Error accepting orders. Please try again.', color: 'red' });
      navigate('/order-request');
      setTimeout(() => {
        setNotification(null);
      }, 2000); // Remove notification after 2 seconds
    }
  };

  const handleCancelUserOrders = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:5000/users/${userId}/cancel-orders`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setOrders(orders.filter(order => order.user_id !== userId));
        setNotification({ type: 'success', message: 'Orders canceled successfully!', color: 'red' });
        setTimeout(() => {
          setNotification(null);
        }, 2000); // Remove notification after 2 seconds
      }
    } catch (err) {
      console.error('Error canceling orders:', err);
      setNotification({ type: 'error', message: 'Error canceling orders. Please try again.', color: 'red' });
      setTimeout(() => {
        setNotification(null);
      }, 2000); // Remove notification after 2 seconds
    }
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.user_id]) {
      acc[order.user_id] = [];
    }
    acc[order.user_id].push(order);
    return acc;
  }, {});

  return (
    <>
      <NavbarAdmin />
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Order Requests</h2>
        {notification && (
          <div className={`bg-${notification.color}-500 text-white p-4 mb-4`}>
            {notification.message}
            <button onClick={clearNotification} className="float-right">
              &#x2715;
            </button>
          </div>
        )}
        {Object.keys(groupedOrders).length > 0 ? (
          Object.keys(groupedOrders).map(userId => (
            <div key={userId} className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <h3 className="text-xl font-bold p-4">User ID: {userId}</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="text-center border-t">
                    <th className="py-2 px-4">Product</th>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Price</th>
                    <th className="py-2 px-4">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedOrders[userId].map(order => (
                    <tr key={order.order_id} className="text-center border-t">
                      <td className="py-2 px-4">
                        <img
                          src={`http://localhost:5000/uploads/${order.photo}`}
                          alt={order.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="py-2 px-4">{order.name}</td>
                      <td className="py-2 px-4">${Number(order.price).toFixed(2)}</td>
                      <td className="py-2 px-4">{order.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end p-4">
                <button
                  onClick={() => handleAcceptUserOrders(userId)}
                  className="bg-green-500 text-white py-2 px-4 rounded mr-2"
                >
                  Accept All Orders
                </button>
                <button
                  onClick={() => handleCancelUserOrders(userId)}
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Cancel All Orders
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No pending orders found.</p>
        )}
      </div>
    </>
  );
};

export default OrderRequest;
