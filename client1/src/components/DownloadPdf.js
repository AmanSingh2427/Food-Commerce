import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is correctly imported

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
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
      console.log('User data fetched:', response.data); // Log user data
      setUserIds(response.data);
    } catch (error) {
      console.error('Error fetching user IDs:', error);
    }
  };

  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchAllOrders = async () => {
    let allOrders = [];
    const totalPages = Math.ceil(totalOrders / ordersPerPage);

    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get('http://localhost:5000/api/orders', {
        params: { userId: selectedUserId || null, date: date || null, page: page, limit: ordersPerPage },
      });
      allOrders = allOrders.concat(response.data.orders);
    }

    return allOrders;
  };

  const downloadPDF = async () => {
    try {
      const allOrders = await fetchAllOrders();

      const doc = new jsPDF('p', 'pt', 'a4');
      const rowsPerPage = 30; // Number of rows per page
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      const cellWidth = (pageWidth - margin * 2) / 7; // 7 columns
      let rowCount = 0;

      const generateTableHeaders = () => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Order ID', margin, margin);
        doc.text('User ID', margin + cellWidth, margin);
        doc.text('Product ID', margin + cellWidth * 2, margin);
        doc.text('Quantity', margin + cellWidth * 3, margin);
        doc.text('Status', margin + cellWidth * 4, margin);
        doc.text('Created At', margin + cellWidth * 5, margin);
        doc.text('Rating', margin + cellWidth * 6, margin);
      };

      const generateTableContent = (orders, startY) => {
        doc.setFont('helvetica', 'normal');
        orders.forEach((order, index) => {
          const y = startY + index * 20;
          doc.text(order.order_id?.toString() || '', margin, y);
          doc.text(order.user_id?.toString() || '', margin + cellWidth, y);
          doc.text(order.product_id?.toString() || '', margin + cellWidth * 2, y);
          doc.text(order.quantity?.toString() || '', margin + cellWidth * 3, y);
          doc.text(order.status || '', margin + cellWidth * 4, y);
          doc.text(new Date(order.created_at).toLocaleDateString() || '', margin + cellWidth * 5, y);
          doc.text(order.rating?.toString() || '', margin + cellWidth * 6, y);
        });
      };

      for (let i = 0; i < allOrders.length; i += rowsPerPage) {
        const chunk = allOrders.slice(i, i + rowsPerPage);
        if (rowCount > 0) {
          doc.addPage();
        }
        generateTableHeaders();
        generateTableContent(chunk, margin + 20);
        rowCount += chunk.length;
      }

      doc.save('order-history.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        {/* User Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Username"
            value={selectedUsername}
            onClick={() => setShowUserSearch(true)}
            onChange={(e) => setSelectedUsername(e.target.value)}
            className="p-2 border rounded w-48"
          />
          {showUserSearch && userIds.length > 0 && (
            <ul className="absolute bg-white border mt-1 rounded w-full max-h-40 overflow-y-auto">
              {userIds
                .filter((user) => user.username.toLowerCase().includes(selectedUsername.toLowerCase()))
                .map((user) => (
                  <li
                    key={user.id} // Make sure this matches the property name returned by your API
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      console.log('User selected:', user); // Log selected user
                      setSelectedUserId(user.id?.toString() || ''); // Safely access properties
                      setSelectedUsername(user.username || '');
                      setShowUserSearch(false);
                    }}
                  >
                    {user.username}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded"
        />
        <button onClick={downloadPDF} className="px-4 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 focus:outline-none">
          Download PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-gray-100">
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
                <td className="py-2 px-4 border" colSpan="7">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded shadow-lg ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || orders.length === 0}
          className={`px-4 py-2 rounded shadow-lg ${currentPage === totalPages || orders.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderHistory;
