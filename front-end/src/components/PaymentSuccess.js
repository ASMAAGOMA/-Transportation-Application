import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import { Loader2 } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const token = useSelector(selectCurrentToken);
  
  useEffect(() => {
    const handleSuccessfulPayment = async () => {
      try {
        // Get session_id from URL if present
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          throw new Error('No session ID found in URL');
        }

        // Fetch booking details using session ID
        const response = await fetch(`http://localhost:3500/api/booking/session/${sessionId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const bookingData = await response.json();
        
        // Update booking status to completed
        await fetch(`http://localhost:3500/api/booking/${bookingData.bookingId}/status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'completed' })
        });

        // Navigate to booked trips page
        navigate('/booked-trips');
      } catch (err) {
        console.error('Error handling successful payment:', err);
        setError(err.message);
      }
    };

    handleSuccessfulPayment();
  }, [navigate, searchParams, token]);

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