import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'tailwindcss/tailwind.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [date, setDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
    fetchUserIds();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [selectedUserId, date, currentPage]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        params: { userId: selectedUserId || null, date: date || null, page: currentPage, limit: ordersPerPage },
      });
      setOrders(response.data.orders);
      setTotalOrders(response.data.totalOrders);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const fetchUserIds = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUserIds(response.data);
    } catch (error) {
      console.error('Error fetching user IDs:', error);
    }
  };

  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  const handleDownloadPDF = () => {
    const input = document.getElementById('order-history-table');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgHeight = (canvas.height * 208) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, 208, imgHeight);
      pdf.save('order-history.pdf');
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        {/* User Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by User ID"
            value={selectedUserId}
            onClick={() => setShowUserSearch(true)}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="p-2 border rounded w-48"
          />
          {showUserSearch && userIds.length > 0 && (
            <ul className="absolute bg-white border mt-1 rounded w-full max-h-40 overflow-y-auto">
              {userIds
                .filter((user) => user.user_id.toString().includes(selectedUserId))
                .map((user) => (
                  <li
                    key={user.user_id}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setSelectedUserId(user.user_id.toString());
                      setShowUserSearch(false);
                    }}
                  >
                    {user.user_id}
                  </li>
                ))}
            </ul>
          )}
        </div>
        {/* Date Input */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded"
        />
        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Download PDF
        </button>
      </div>
      {/* Table */}
      <table id="order-history-table" className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Order ID</th>
            <th className="py-2 px-4 border">User ID</th>
            <th className="py-2 px-4 border">Product ID</th>
            <th className="py-2 px-4 border">Quantity</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Created At</th>
            <th className="py-2 px-4 border">Rating</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border">{order.order_id}</td>
                <td className="py-2 px-4 border">{order.user_id}</td>
                <td className="py-2 px-4 border">{order.product_id}</td>
                <td className="py-2 px-4 border">{order.quantity}</td>
                <td className="py-2 px-4 border">{order.status}</td>
                <td className="py-2 px-4 border">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{order.rating}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-2 px-4 border text-center text-red-500">No data present</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={currentPage === totalPages || orders.length === 0}
        >
          Next
        </button>
      </div>
      {/* No more data message */}
      {currentPage === totalPages && orders.length === 0 && (
        <div className="text-center mt-4 text-red-500">
          No more data available.
        </div>
      )}
    </div>
  );
};

export default OrderHistory;