import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import { Loader2, XCircle, CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('processing');
  const token = useSelector(selectCurrentToken);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const bookingId = searchParams.get('booking_id');

    const verifyPayment = async () => {
        try {
          const response = await fetch('http://localhost:3500/api/booking/verify-payment', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId, bookingId })
          });
  
          if (!response.ok) {
            throw new Error('Payment verification failed');
          }
  
          const result = await response.json();
          
          if (result.success) {
            setStatus('success');
            // Add a longer delay before redirect to ensure the booking is processed
            setTimeout(() => {
              navigate('/booked-trips', { 
                replace: true,
                state: { refresh: true } // Add state to trigger refresh
              });
            }, 3000);
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Verification error:', error);
          setStatus('error');
        }
      };
  
      if (sessionId && bookingId) {
        verifyPayment();
      } else {
        setStatus('error');
      }
    }, [location, navigate, token, sessionId, bookingId]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
            <p className="mt-4 text-gray-600">Verifying your payment...</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="mt-4 text-gray-600">Payment successful! Redirecting...</p>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="mt-4 text-gray-600">Payment verification failed</p>
            <button
              onClick={() => navigate('/booking')}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Return to Booking
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentSuccess;