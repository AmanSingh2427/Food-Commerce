import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from '../Footer';

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

    const deleteAllOrders = async () => {
        try {
            await axios.delete(`http://localhost:5000/orders/${userId}`);
            setPendingOrders([]);
        } catch (error) {
            console.error('Error deleting orders:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen">
                <div className="container mx-auto mt-8 flex flex-col items-center justify-center flex-grow  ">
                    <h2 className="text-2xl font-bold mb-4">Product Processing</h2>
                    {loading ? (
                        <p className="text-gray-700 text-center">Loading...</p>
                    ) : pendingOrders.length > 0 ? (
                        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-4xl">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-center border-t">
                                        <th className="py-2 px-4">Order ID</th>
                                        <th className="py-2 px-4">Product</th>
                                        <th className="py-2 px-4">Name</th>
                                        <th className="py-2 px-4">Price</th>
                                        <th className="py-2 px-4">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingOrders.map((item) => (
                                        <tr key={item.order_id} className="text-center border-t">
                                            <td className="py-2 px-4">{item.order_id}</td>
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
                            <div className="text-center mt-4">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={deleteAllOrders}
                                >
                                    Delete Order
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center">
                            Your all order has been delivered successfully. Please add item to cart and placed orders.
                        </p>
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default ProductProcessing;
