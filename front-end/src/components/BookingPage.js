import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { MapPin, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../features/auth/authSlice';

const STRIPE_PUBLIC_KEY = "pk_test_51QW3x1HzLvE2BAXyeFXNvnWXKCevhEShDCloQgsmGCy6quNinNw8iAdmEFUzligLxlcOL4J04op5l9l3C0LDOUY000vB7o4VPC";
const API_URL = 'http://localhost:3500'; // Use local API URL

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tripDetails = location.state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);

  const [formData, setFormData] = useState({
    tickets: 1,
    paymentType: "full",
  });

  useEffect(() => {
    if (!user || !token) {
      navigate('/login', { state: { from: location } });
    }
  }, [user, token, navigate, location]);

  if (!tripDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Book a wonderful trip
            </h1>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                Upcoming Adventures
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-12 text-center">
            <MapPin className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              No booking Trips Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start exploring and add some exciting destinations to book it!
            </p>
            <button
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={() => navigate("/")}
            >
              Explore Trips
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = formData.paymentType === "full"
  ? Math.round(tripDetails.price * formData.tickets)
  : Math.round((tripDetails.price * formData.tickets) / 2);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  setError(null);
};

const makePayment = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    if (!user?._id) {
      throw new Error("Please log in to continue with booking");
    }

    const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
    
    if (!stripe) {
      throw new Error("Failed to initialize payment system");
    }

    // Remove userId from bookingData
    const bookingData = {
      tickets: formData.tickets,
      paymentType: formData.paymentType,
      totalPrice: totalPrice,
      tripId: tripDetails._id,
      destination: tripDetails.destination,
      userEmail: user.email
    };

    const response = await fetch(`${API_URL}/api/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Payment failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.paymentUrl) {
      window.location.href = data.paymentUrl;
    } else {
      throw new Error("Invalid payment response");
    }
  } catch (error) {
    console.error("Error during payment:", error);
    setError(error.message || "Payment failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100 p-2 sm:p-4">
    <div className="w-full max-w-3xl bg-white p-3 sm:p-6 rounded-lg shadow-lg">
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Booking for: {tripDetails.destination}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Price per ticket: ${tripDetails.price}</p>
        <p className="text-sm sm:text-base text-gray-600">Origin: {tripDetails.origin}</p>
        <p className="text-sm sm:text-base text-gray-600">Start Date: {tripDetails.startDate}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-lg mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}

      <form onSubmit={makePayment} className="bg-gray-50 p-3 sm:p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <label className="block">
            <span className="text-sm sm:text-base text-gray-700">Number of Tickets:</span>
            <input
              type="number"
              name="tickets"
              value={formData.tickets}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 text-sm sm:text-base"
            />
          </label>

          <label className="block">
            <span className="text-sm sm:text-base text-gray-700">Payment Type:</span>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 text-sm sm:text-base"
            >
              <option value="full">Full Payment</option>
              <option value="half">Half Payment</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm sm:text-base text-gray-700">Total Price:</span>
            <div className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 text-sm sm:text-base">
              ${totalPrice.toFixed(2)}
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 sm:mt-6 bg-indigo-500 text-white py-2 sm:py-3 rounded-md hover:bg-indigo-600 transition duration-300 text-sm sm:text-base ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  </div>
);
};

export default BookingPage;