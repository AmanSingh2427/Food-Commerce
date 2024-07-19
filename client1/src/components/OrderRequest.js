import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderRequest = () => {
  const [orders, setOrders] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pending-orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Group orders by order_id
        const groupedOrders = response.data.reduce((acc, order) => {
          if (!acc[order.order_id]) {
            acc[order.order_id] = [];
          }
          acc[order.order_id].push(order);
          return acc;
        }, {});

        setOrders(groupedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, []);

  const handleAcceptUserOrders = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:5000/orders/${orderId}/accept`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        const newOrders = { ...orders };
        delete newOrders[orderId];
        setOrders(newOrders);
        toast.success('Orders accepted successfully!');
      }
    } catch (err) {
      console.error('Error accepting orders:', err);
      toast.error('Error accepting orders. Please try again.');
    }
  };

  const handleCancelUserOrders = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:5000/orders/${orderId}/cancel`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        const newOrders = { ...orders };
        delete newOrders[orderId];
        setOrders(newOrders);
        toast.success('Orders canceled successfully!');
      }
    } catch (err) {
      console.error('Error canceling orders:', err);
      toast.error('Error canceling orders. Please try again.');
    }
  };

  return (
    <>
      <NavbarAdmin />
      <ToastContainer />
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Order Requests</h2>
        {Object.keys(orders).length > 0 ? (
          Object.keys(orders).map(orderId => (
            <div key={orderId} className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <h3 className="text-xl font-bold p-4">Order ID: {orderId}</h3>
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
                  {orders[orderId].map(order => (
                    <tr key={order.id} className="text-center border-t">
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
                  onClick={() => handleAcceptUserOrders(orderId)}
                  className="bg-green-500 text-white py-2 px-4 rounded mr-2"
                >
                  Accept this Orders
                </button>
                <button
                  onClick={() => handleCancelUserOrders(orderId)}
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Cancel this Orders
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
