import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from './components/Layout';
import Login from './features/auth/Login';
import SignUp from './features/auth/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './features/auth/PersistLogin';
import BookingPage from './components/BookingPage';
import PendingTrips from './components/PendingTrips';
import { selectCurrentToken } from './features/auth/authSlice';
import { useRefreshMutation } from './features/auth/authApiSlice';

import './index.css';
import './globals.css';

import {loadStripe} from '@stripe/stripe-js';
const stripe = await loadStripe('pk_test_51QW3x1HzLvE2BAXyeFXNvnWXKCevhEShDCloQgsmGCy6quNinNw8iAdmEFUzligLxlcOL4J04op5l9l3C0LDOUY000vB7o4VPC');

function App() {
  const token = useSelector(selectCurrentToken);
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      console.log('verifying refresh token');
      try {
        await refresh().unwrap();
        console.log('refresh token still valid');
      } catch (err) {
        console.error('refresh token expired');
      }
    };

    if (!token) {
      verifyRefreshToken();
    }
  }, [token, refresh]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Protected routes */}
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pending" element={<PendingTrips />} />
            <Route path="/booking" element={<BookingPage />}></Route>
            {/* Add other protected routes here */}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;