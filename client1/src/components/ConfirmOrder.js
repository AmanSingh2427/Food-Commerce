import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from 'qrcode.react';

const ConfirmOrder = () => {
    const [enteredAmount, setEnteredAmount] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const { userId, totalPayableAmount } = location.state;

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(enteredAmount) === totalPayableAmount) {
            try {
                await axios.post(`http://localhost:5000/place-order/${userId}`);
                toast.success('Your order has been placed successfully!');
                await delay(2000); // Wait for 2 seconds
                navigate('/product-processing');
            } catch (error) {
                console.error('Error placing order:', error);
                toast.error('Error placing order. Please try again.');
            }
        } else {
            setError('Entered amount does not match the total payable amount.');
            toast.error('Entered amount does not match the total payable amount.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4">Confirm Your Order</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Scan QR Code to Pay:</label>
                        <QRCode
                            value={`Total Payable Amount: ${totalPayableAmount}`}
                            size={256}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"Q"}
                            includeMargin={false}
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Total Payable Amount: <span className="font-bold">${totalPayableAmount}</span></label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Enter Total Amount:</label>
                        <input
                            type="number"
                            value={enteredAmount}
                            onChange={(e) => setEnteredAmount(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded w-full"
                        />
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    >
                        Confirm Order
                    </button>
                </form>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default ConfirmOrder;
