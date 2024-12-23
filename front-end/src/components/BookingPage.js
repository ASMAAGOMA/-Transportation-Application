import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { MapPin, Calendar, Clock, CreditCard, Users, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';

const stripePromise = loadStripe("pk_test_51QW3x1HzLvE2BAXyeFXNvnWXKCevhEShDCloQgsmGCy6quNinNw8iAdmEFUzligLxlcOL4J04op5l9l3C0LDOUY000vB7o4VPC");

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tripDetails = location.state;
  const [loading, setLoading] = useState(false);
  const token = useSelector(selectCurrentToken);

  const [formData, setFormData] = useState({
    tickets: 1,
    paymentType: "full",
  });

  if (!tripDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <MapPin className="w-24 h-24 text-indigo-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No Trip Selected
          </h2>
          <p className="text-gray-600 mb-8">
            Please select a trip to proceed with booking.
          </p>
          <button 
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Browse Trips
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = formData.paymentType === "full"
    ? Math.round(tripDetails?.price * formData.tickets)
    : Math.round((tripDetails?.price * formData.tickets) / 2);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const makePayment = async () => {
    if (!token) {
      console.error("No user token available");
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await fetch('http://localhost:3500/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
        body: JSON.stringify({
          tickets: formData.tickets,
          paymentType: formData.paymentType,
          totalPrice: totalPrice,
          tripId: tripDetails._id,
          destination: tripDetails.destination,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      navigate('/success'); // Redirect to success page
    } catch (error) {
      console.error('Error during payment:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Trips
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-64">
            <img
              src={tripDetails.image ? `http://localhost:3500/uploads/${tripDetails.image}` : '/images/default-trip.jpg'}
              alt={tripDetails.destination}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{tripDetails.destination}</h1>
              <p className="text-lg opacity-90">From {tripDetails.origin}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Departure Date</p>
                  <p className="font-medium">{format(new Date(tripDetails.startDate), 'PPP')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{tripDetails.duration} hours</p>
                </div>
              </div>
            </div>

            <form onSubmit={makePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  name="tickets"
                  value={formData.tickets}
                  onChange={handleChange}
                  min="1"
                  max={tripDetails.maxPassengers - (tripDetails.currentPassengers || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="full">Full Payment</option>
                  <option value="half">Half Payment (50% Deposit)</option>
                </select>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price per ticket</span>
                  <span className="font-medium">${tripDetails.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Number of tickets</span>
                  <span className="font-medium">{formData.tickets}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment type</span>
                  <span className="font-medium">
                    {formData.paymentType === "full" ? "Full Payment" : "50% Deposit"}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Price</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 
                  transition-colors flex items-center justify-center gap-2 ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                <CreditCard className="w-5 h-5" />
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;