import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      // Show toast notification and handle redirection
      await toast.promise(
        axios.post('http://localhost:5000/reset-password', { otp, newPassword }),
        {
          pending: 'Processing...',
          success: {
            render() {
              // Redirect to login page after success message is displayed
              setTimeout(() => navigate('/login'), 2000);
              return 'Password reset successfully!';
            },
          },
          error: 'Failed to reset password. Please try again.',
        }
      );
    } catch (error) {
      console.error(error.response.data.message);
      // Error message will be shown by toast.promise
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
          <form onSubmit={handleResetPasswordSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mb-4 p-2 w-full border rounded"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mb-4 p-2 w-full border rounded"
            />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mb-4 p-2 w-full border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer for displaying notifications */}
    </>
  );
};

export default ResetPassword;
