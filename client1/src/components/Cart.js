import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
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
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalCost(total);
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

    const placeOrder = async () => {
        try {
            await axios.post(`http://localhost:5000/place-order/${userId}`);
            console.log('Order placed successfully');
            navigate('/product-processing'); // Navigate to the product processing page
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const redirectToPurchaseHistory = () => {
        navigate('/purchase-history');
    };

    return (
        <div className="container mx-auto mt-8">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button onClick={redirectToPurchaseHistory} className="bg-green-500 text-white px-4 py-2 rounded">
                    Purchase History
                </button>
            </div>
            {cartItems.length > 0 ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Cart items */}
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-center border-t">
                                <th className="py-2 px-4">Product</th>
                                <th className="py-2 px-4">Name</th>
                                <th className="py-2 px-4">Price</th>
                                <th className="py-2 px-4">Quantity</th>
                                <th className="py-2 px-4">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id} className="text-center border-t">
                                    {/* Product details */}
                                    <td className="py-2 px-4">
                                        <img
                                            src={`http://localhost:5000/uploads/${item.photo}`}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td className="py-2 px-4">{item.name}</td>
                                    <td className="py-2 px-4">${Number(item.price).toFixed(2)}</td>
                                    {/* Quantity control */}
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
                                    {/* Total cost for the item */}
                                    <td className="py-2 px-4">${(Number(item.price) * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* State selector */}
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
                    {/* Bill Calculation */}
                    <div className="p-4 bg-gray-100">
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold">Food Cost:</span>
                            <span>${totalCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold">GST ({selectedState === 'Uttar Pradesh' ? '12%' : '18%'}):</span>
                            <span>${calculateGST()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Total Payable Amount:</span>
                            <span>${totalPayableAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center mt-16">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500">You have no items in your cart. Add some products to see them here!</p>
                </div>
            )}
            {/* Place order button */}
            {cartItems.length > 0 && (
                <div className="flex justify-end mt-4">
                    <button onClick={placeOrder} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
