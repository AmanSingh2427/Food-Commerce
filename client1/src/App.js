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
import UpdateUserProfile from './components/UpdateUserProfile'

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

          <Route path="/adminhome" element={<PrivateRoute requiredRole="admin"><Layout><AdminHome /></Layout></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
          <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
          <Route path="/updateadmin-profile" element={<PrivateRoute><Layout><UpdateProfile /></Layout></PrivateRoute>} />

          <Route path="/updateuser-profile" element={<PrivateRoute><><UpdateUserProfile /></></PrivateRoute>} />
          
          <Route path="/products" element={<PrivateRoute><Layout><ProductsTable /></Layout></PrivateRoute>} />
          <Route path="/create-product" element={<PrivateRoute><Layout><CreateProductForm /></Layout></PrivateRoute>} />
          <Route path="/user-requests" element={<PrivateRoute><Layout><UserRequests /></Layout></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/product-processing" element={<PrivateRoute><><ProductProcessing /></></PrivateRoute>} />
          <Route path="/order-request" element={<PrivateRoute><Layout><OrderRequest /></Layout></PrivateRoute>} />
          <Route path="/purchase-history" element={<PrivateRoute><><PurchaseHistory /></></PrivateRoute>} />
          <Route path="/update/:productId" element={<PrivateRoute><Layout><UpdateProduct /></Layout></PrivateRoute>} />

          <Route path="/notauthorized" element={<NotAuthorized />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
