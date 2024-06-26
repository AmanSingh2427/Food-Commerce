import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PurchaseHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const userId = localStorage.getItem('userId');

      try {
        const response = await axios.get(`http://localhost:5000/order-history/${userId}`);
        setOrderHistory(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching order history:', error);
        setLoading(false); // Handle loading state in case of error
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Order history */}
          <table className="min-w-full">
            <thead>
              <tr className="text-center border-t">
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map(order => (
                <tr key={order.id} className="text-center border-t">
                  <td className="py-2 px-4">{order.order_id}</td>
                  <td className="py-2 px-4">{order.quantity}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
