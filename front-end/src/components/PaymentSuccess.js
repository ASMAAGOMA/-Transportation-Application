import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSuccessfulPayment = async () => {
      try {
        // Retrieve booking details from localStorage
        const pendingBooking = JSON.parse(localStorage.getItem('pendingBooking'));
        if (!pendingBooking) {
          throw new Error('No booking details found');
        }

        // Create the booking in the database
        const response = await fetch('http://localhost:3500/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add your auth header here
          },
          body: JSON.stringify(pendingBooking)
        });

        if (!response.ok) {
          throw new Error('Failed to create booking');
        }

        // Clear the pending booking from localStorage
        localStorage.removeItem('pendingBooking');

        // Redirect to booked trips page after 3 seconds
        setTimeout(() => {
          navigate('/booked-trips');
        }, 3000);

      } catch (error) {
        console.error('Error handling successful payment:', error);
      }
    };

    handleSuccessfulPayment();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Your booking has been confirmed. You will be redirected to your booked trips shortly.
        </p>
        
        <div className="animate-pulse text-sm text-gray-500">
          Redirecting...
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;