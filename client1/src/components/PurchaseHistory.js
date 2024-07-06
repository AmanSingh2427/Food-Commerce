import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import Navbar from './Navbar';
import Footer from '../Footer';

const PurchaseHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const userId = localStorage.getItem('userId');

      try {
        const response = await axios.get(`http://localhost:5000/order-history/${userId}`, {
          params: { page: currentPage, limit: itemsPerPage },
        });
        setOrderHistory(response.data.orders);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order history:', error);
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [currentPage]);

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
      setNotification(`Rating submitted successfully for order ID: ${orderId}`);
      setTimeout(() => {
        setNotification('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting rating:', error);
      setNotification('Failed to submit rating');
      setTimeout(() => {
        setNotification('');
      }, 2000);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto mt-8 flex-grow">
          <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
          {notification && (
            <div className="mb-4 text-center text-white bg-green-500 p-2 rounded">
              {notification}
            </div>
          )}
          {loading ? (
            <p>Loading...</p>
          ) : orderHistory.length === 0 ? (
            <p>No order history found.</p>
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
                        <img src={`http://localhost:5000/uploads/${order.photo}`} alt="Product" className="w-16 h-16 mx-auto" />
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
              <div className="flex justify-center py-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 mx-1 bg-gray-300 rounded"
                >
                  Previous
                </button>
                <span className="px-4 py-2 mx-1">{currentPage}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 mx-1 bg-gray-300 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PurchaseHistory;
