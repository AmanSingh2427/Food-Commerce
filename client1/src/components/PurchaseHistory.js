import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

const PurchaseHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const userId = localStorage.getItem('userId');

      try {
        const response = await axios.get(`http://localhost:5000/order-history/${userId}`);
        setOrderHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order history:', error);
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const handleRatingChange = (orderId, value) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [orderId]: value,
    }));
  };

  const handleRatingSubmit = async (orderId) => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.post(`http://localhost:5000/submit-rating`, {
        userId,
        orderId,
        rating: ratings[orderId],
      });
      alert('Rating submitted successfully');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="text-center border-b">
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Product Image</th>
                <th className="py-2 px-4">Product ID</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map(order => (
                <tr key={order.id} className="text-center border-t">
                  <td className="py-2 px-4">{order.order_id}</td>
                  <td className="py-2 px-4">
                    <img src={`http://localhost:5000/uploads/${order.photo}`} alt="Product" className="w-16 h-16 mx-auto"/>
                  </td>
                  <td className="py-2 px-4">{order.product_id}</td>
                  <td className="py-2 px-4">{order.quantity}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    {order.status === 'accepted' ? (
                      <>
                        <StarRating
                          rating={ratings[order.id] || 0}
                          onRatingChange={(value) => handleRatingChange(order.id, value)}
                        />
                        <button
                          onClick={() => handleRatingSubmit(order.id)}
                          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Submit
                        </button>
                      </>
                    ) : (
                      <p>N/A</p>
                    )}
                  </td>
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
