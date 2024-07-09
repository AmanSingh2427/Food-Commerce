import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from '../Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductProcessing = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchPendingOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/pending-orders/${userId}`);
                setPendingOrders(response.data);
            } catch (error) {
                console.error('Error fetching pending orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchPendingOrders();
        }
    }, [userId]);

    const deleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:5000/orders/${userId}/${orderId}`);
            // Update state to remove cancelled order
            setPendingOrders(prevOrders => prevOrders.filter(order => order.order_id !== orderId));
            toast.success('Order cancelled successfully');
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Failed to cancel order');
        }
    };

    const groupOrdersByOrderId = (orders) => {
        return orders.reduce((acc, order) => {
            if (!acc[order.order_id]) {
                acc[order.order_id] = [];
            }
            acc[order.order_id].push(order);
            return acc;
        }, {});
    };

    const groupedOrders = groupOrdersByOrderId(pendingOrders);

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen">
                <div className="container mx-auto mt-8 flex flex-col items-center justify-center flex-grow">
                    <h2 className="text-2xl font-bold mb-4">Product Processing</h2>
                    {loading ? (
                        <p className="text-gray-700 text-center">Loading...</p>
                    ) : Object.keys(groupedOrders).length > 0 ? (
                        Object.keys(groupedOrders).map(orderId => (
                            <div key={orderId} className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-4xl mb-8">
                                <h3 className="text-xl font-semibold text-center mt-4">Order ID: {orderId}</h3>
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
                                        {groupedOrders[orderId].map((item) => (
                                            <tr key={item.product_id} className="text-center border-t">
                                                <td className="py-2 px-4">
                                                    <img
                                                        src={`http://localhost:5000/uploads/${item.photo}`}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                </td>
                                                <td className="py-2 px-4">{item.name}</td>
                                                <td className="py-2 px-4">${Number(item.price).toFixed(2)}</td>
                                                <td className="py-2 px-4">{item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="text-center mt-4 mb-4">
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={() => deleteOrder(orderId)}
                                    >
                                        Delete Order
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700 text-center">
                            Your all orders have been delivered successfully. Please add items to cart and place orders.
                        </p>
                    )}
                </div>
                <Footer />
                <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
            </div>
        </>
    );
};

export default ProductProcessing;
