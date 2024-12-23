import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import { Loader2 } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const token = useSelector(selectCurrentToken);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const stripeSessionId = searchParams.get('session_id');

    const handleSuccessfulPayment = async () => {
      try {
        const response = await fetch(`http://localhost:3500/api/booking/verify-payment`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionId: stripeSessionId })
        });

        if (!response.ok) {
          throw new Error('Payment verification failed');
        }

        navigate('/booked-trips', { replace: true });
      } catch (err) {
        setError(err.message);
      }
    };

    if (stripeSessionId) {
      handleSuccessfulPayment();
    }
  }, [navigate, location, token]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-red-600 text-xl font-semibold mb-4">Payment Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/booking')}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Return to Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
        <p className="mt-4 text-gray-600">Processing your payment...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;