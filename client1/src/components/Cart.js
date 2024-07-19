import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from '../Footer';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalBeforeDiscount, setTotalBeforeDiscount] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [selectedState, setSelectedState] = useState('Uttar Pradesh');
    const [totalPayableAmount, setTotalPayableAmount] = useState(0);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/cart/${userId}`);
                setCartItems(response.data);
                calculateFoodCost(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            await removeCartItem(itemId);
        } else {
            try {
                await axios.put(`http://localhost:5000/cart/${userId}/${itemId}`, { quantity });
                setCartItems(prevItems =>
                    prevItems.map(item => (item.id === itemId ? { ...item, quantity } : item))
                );
            } catch (error) {
                console.error('Error updating cart item quantity:', error);
            }
        }
    };

    const removeCartItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/cart/${userId}/${itemId}`);
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    useEffect(() => {
        calculateFoodCost(cartItems);
    }, [cartItems]);

    useEffect(() => {
        calculateTotalPayableAmount(totalCost);
    }, [totalCost, selectedState]);

    const calculateFoodCost = (items) => {
        const totalBefore = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const totalAfterDiscount = items.reduce((acc, item) => {
            const discountedPrice = item.price * (1 - item.discount / 100);
            return acc + discountedPrice * item.quantity;
        }, 0);
        setTotalBeforeDiscount(totalBefore);
        setTotalCost(totalAfterDiscount);
    };

    const calculateGST = () => {
        if (selectedState === 'Uttar Pradesh') {
            return (totalCost * 0.12).toFixed(2); // 12% SGST
        } else {
            return (totalCost * 0.18).toFixed(2); // 18% CGST
        }
    };

    const calculateTotalPayableAmount = (foodCost) => {
        const gst = selectedState === 'Uttar Pradesh' ? 0.12 : 0.18;
        const totalPayable = foodCost + (foodCost * gst);
        setTotalPayableAmount(totalPayable);
    };

    const placeOrder = () => {
        navigate('/confirm-order', {
            state: { userId, totalPayableAmount },
        });
    };

    const redirectToPurchaseHistory = () => {
        navigate('/purchase-history');
    };

    const redirectToProductProcessing = () => {
        navigate('/product-processing');
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen">
                <div className="container mx-auto mt-8 flex-grow">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-2xl font-bold">Your Cart</h2>
                        <div>
                            <button onClick={redirectToProductProcessing} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
                                Track Product
                            </button>
                            <button onClick={redirectToPurchaseHistory} className="bg-green-500 text-white px-4 py-2 rounded">
                                Purchase History
                            </button>
                        </div>
                    </div>
                    {cartItems.length > 0 ? (
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-center border-t">
                                        <th className="py-2 px-4">Product</th>
                                        <th className="py-2 px-4">Name</th>
                                        <th className="py-2 px-4">Price</th>
                                        <th className="py-2 px-4">Discount</th>
                                        <th className="py-2 px-4">Quantity</th>
                                        <th className="py-2 px-4">Total</th>
                                        {/* <th className="py-2 px-4">Total After Discount</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id} className="text-center border-t">
                                            <td className="py-2 px-4">
                                                <img
                                                    src={`http://localhost:5000/uploads/${item.photo}`}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            </td>
                                            <td className="py-2 px-4">{item.name}</td>
                                            <td className="py-2 px-4">₹{Number(item.price).toFixed(2)}</td>
                                            <td className="py-2 px-4">{item.discount}%</td>
                                            <td className="py-2 px-4 flex items-center justify-center space-x-2">
                                                <button
                                                    className="bg-gray-300 px-2 rounded"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    className="bg-gray-300 px-2 rounded"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </td>
                                            <td className="py-2 px-4">
                                            ₹{Number(item.price * item.quantity).toFixed(2)}
                                            </td>
                                            {/* <td className="py-2 px-4">
                                                ${((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2)}
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-4 flex justify-end">
                                <div className="flex items-center">
                                    <span className="font-semibold mr-2">Select State:</span>
                                    <select
                                        value={selectedState}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        className="border border-gray-300 px-2 py-1 rounded"
                                    >
                                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                                        <option value="Other">Other State</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-4 text-right">
                                <div className="text-lg font-semibold">Total Before Discount: ₹{Number(totalBeforeDiscount).toFixed(2)}</div>
                                <div className="text-lg font-semibold">Food Cost After Discount: ₹{Number(totalCost).toFixed(2)}</div>
                                <div className="text-lg font-semibold">GST: ₹{calculateGST()}</div>
                                <div className="text-2xl font-bold">Total Payable Amount: ₹{Number(totalPayableAmount).toFixed(2)}</div>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                                    onClick={placeOrder}
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center">Your cart is empty</p>
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Cart;
