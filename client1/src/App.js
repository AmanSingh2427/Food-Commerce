import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import PrivateRoute from './PrivateRoute';
import About from './components/About';
import Contact from './components/Contact';
import UpdateProfile from './components/UpdateProfile';
import ResetPassword from './ResetPassword';
import AdminHome from './AdminHome';
import NotAuthorized from './NotAuthorized';
import ProductsTable from './components/ProductsTable';
import UpdateProduct from './components/UpdateProduct';
import Cart from './components/Cart';
import ProductProcessing from './components/ProductProcessing';
import OrderRequest from './components/OrderRequest';
import PurchaseHistory from './components/PurchaseHistory';
import CreateProductForm from './components/CreateProductForm';
import Layout from './Layout';
import UserRequests from './components/UserRequests';
import UpdateUserProfile from './components/UpdateUserProfile';
import DownloadPdf from './components/DownloadPdf';
import NotFound from './NotFound';
import UserMessages from './components/UserMessges';
import AllProducts from './components/AllProducts'

const App = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={!token ? <Signup /> : <Navigate to={userRole === 'admin' ? '/adminhome' : '/home'} />} />
          <Route path="/login" element={!token ? <Login /> : <Navigate to={userRole === 'admin' ? '/adminhome' : '/home'} />} />
          <Route path="/reset-password" element={!token ? <ResetPassword /> : <Navigate to={userRole === 'admin' ? '/adminhome' : '/home'} />} />

          <Route path="/" element={<Navigate to={token ? (userRole === 'admin' ? '/adminhome' : '/home') : '/login'} />} />

          {/* Admin routes */}
          <Route path="/adminhome" element={<PrivateRoute requiredRole="admin"><Layout><AdminHome /></Layout></PrivateRoute>} />
          <Route path="/updateadmin-profile" element={<PrivateRoute requiredRole="admin"><Layout><UpdateProfile /></Layout></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute requiredRole="admin"><Layout><ProductsTable /></Layout></PrivateRoute>} />
          <Route path="/all-products" element={<PrivateRoute requiredRole="admin"><Layout><AllProducts /></Layout></PrivateRoute>} />
          <Route path="/create-product" element={<PrivateRoute requiredRole="admin"><Layout><CreateProductForm /></Layout></PrivateRoute>} />
          <Route path="/user-requests" element={<PrivateRoute requiredRole="admin"><Layout><UserRequests /></Layout></PrivateRoute>} />
          <Route path="/order-request" element={<PrivateRoute requiredRole="admin"><Layout><OrderRequest /></Layout></PrivateRoute>} />
          <Route path="/update/:productId" element={<PrivateRoute requiredRole="admin"><Layout><UpdateProduct /></Layout></PrivateRoute>} />
          <Route path="/download-pdf" element={<PrivateRoute requiredRole="admin"><Layout><DownloadPdf /></Layout></PrivateRoute>} />
          <Route path="/user-message" element={<PrivateRoute requiredRole="admin"><Layout><UserMessages /></Layout></PrivateRoute>} />

          {/* User routes */}
          <Route path="/home" element={<PrivateRoute requiredRole="user"><Home /></PrivateRoute>} />
          <Route path="/about" element={<PrivateRoute requiredRole="user"><About /></PrivateRoute>} />
          <Route path="/contact" element={<PrivateRoute requiredRole="user"><Contact /></PrivateRoute>} />
          <Route path="/updateuser-profile" element={<PrivateRoute requiredRole="user"><UpdateUserProfile /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute requiredRole="user"><Cart /></PrivateRoute>} />
          <Route path="/product-processing" element={<PrivateRoute requiredRole="user"><ProductProcessing /></PrivateRoute>} />
          <Route path="/purchase-history" element={<PrivateRoute requiredRole="user"><PurchaseHistory /></PrivateRoute>} />

          <Route path="/notauthorized" element={<NotAuthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
