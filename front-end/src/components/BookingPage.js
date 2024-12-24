import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { MapPin, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../features/auth/authSlice';

const STRIPE_PUBLIC_KEY = "pk_test_51QW3x1HzLvE2BAXyeFXNvnWXKCevhEShDCloQgsmGCy6quNinNw8iAdmEFUzligLxlcOL4J04op5l9l3C0LDOUY000vB7o4VPC";
const API_URL = 'http://localhost:3500';

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
          <MapPin className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No booking Trips Yet</h2>
          <p className="text-gray-500 mb-6">Start exploring and add some exciting destinations to book it!</p>
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => navigate("/")}
          >
            Explore Trips
          </button>
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
      setError(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Booking for: {tripDetails.destination}</h1>
        <p className="text-gray-600 mb-4">Price per ticket: ${tripDetails.price}</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={makePayment} className="space-y-4">
          <div>
            <label className="block text-gray-700">Number of Tickets:</label>
            <input
              type="number"
              name="tickets"
              value={formData.tickets}
              onChange={handleChange}
              min="1"
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700">Payment Type:</label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option value="full">Full Payment</option>
              <option value="half">Half Payment</option>
            </select>
          </div>

          <div className="text-gray-700">Total Price: ${totalPrice.toFixed(2)}</div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
