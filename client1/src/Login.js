import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Custom validation for empty fields
    if (!username) {
      toast.error('Please fill in the Username field.');
      return;
    }
    if (!password) {
      toast.error('Please fill in the Password field.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
      localStorage.setItem('userImage', response.data.userImage);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('email', response.data.email);

      toast.success('Login successful!');
      setTimeout(() => {
        if (response.data.role === 'admin') {
          navigate('/adminhome');
        } else {
          navigate('/home');
        }
      }, 2000);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    // Custom validation for empty fields
    if (!email) {
      toast.error('Please fill in the Email field.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      setIsOtpSent(true);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();

    // Custom validation for empty fields
    if (!email) {
      toast.error('Please fill in the Email field.');
      return;
    }
    if (!otp) {
      toast.error('Please fill in the OTP field.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      toast.success(response.data.message);
      setTimeout(() => navigate('/reset-password'), 2000);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded shadow-md text-center">
          {!isForgotPassword ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Login</h2>
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mb-4 p-2 w-full border rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-4 p-2 w-full border rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="w-full mt-2 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Don't have an Account?
                </button>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="w-full mt-2 text-blue-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">{isOtpSent ? 'Verify OTP' : 'Forgot Password'}</h2>
              <form onSubmit={isOtpSent ? handleVerifyOtpSubmit : handleForgotPasswordSubmit}>
                {isOtpSent ? (
                  <>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="mb-4 p-2 w-full border rounded"
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mb-4 p-2 w-full border rounded"
                    />
                  </>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  {isOtpSent ? 'Verify OTP' : 'Send OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setIsOtpSent(false);
                  }}
                  className="w-full mt-2 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  {isOtpSent ? 'Back to Forgot Password' : 'Back to Login'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer for displaying notifications */}
    </div>
  );
};

export default LoginForm;
