import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { MapPin, Calendar, Clock, CreditCard, Users } from 'lucide-react';
import { format } from 'date-fns';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tripDetails = location.state;

  const [formData, setFormData] = useState({
    tickets: 1,
    paymentType: "full",
  });

  const totalPrice = formData.paymentType === "full"
    ? Math.round(tripDetails?.price * formData.tickets)
    : Math.round((tripDetails?.price * formData.tickets) / 2);

  if (!tripDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                  <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                      Book a wonderfull trip 
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
                      Start exploring and add some exciting destinations to book it !
                  </p>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                          onClick={() => navigate("/")}
                  >
                      Explore Trips
                  </button>
              </div>
              
          </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const makePayment = async (e) => {
    e.preventDefault();
    
    try {
      const stripe = await loadStripe("pk_test_51QW3x1HzLvE2BAXyeFXNvnWXKCevhEShDCloQgsmGCy6quNinNw8iAdmEFUzligLxlcOL4J04op5l9l3C0LDOUY000vB7o4VPC");
      
      const payload = {
        tickets: formData.tickets,
        paymentType: formData.paymentType,
        totalPrice: totalPrice,
        tripId: tripDetails.id,
        destination: tripDetails.destination
      };
  
      const response = await fetch("http://localhost:3500/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error("Failed to process payment");
      
      const { paymentUrl } = await response.json();
      if (paymentUrl) window.location.href = paymentUrl;
      else console.error("Payment URL not found");
      
    } catch (error) {
      console.error("Error during payment:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Trip Overview Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <img
            src={tripDetails.image ? `http://localhost:3500/uploads/${tripDetails.image}` : '/images/default-trip.jpg'}
            alt={tripDetails.destination}
            className="w-full h-64 object-cover"
          />
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {tripDetails.destination}
            </h1>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span className="text-gray-600">From {tripDetails.origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span className="text-gray-600">
                  {format(new Date(tripDetails.startDate), 'PPP')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="text-gray-600">{tripDetails.duration} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="text-gray-600">
                  {tripDetails.maxPassengers - (tripDetails.currentPassengers || 0)} seats left
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Booking Details</h2>
          
          <form onSubmit={makePayment} className="space-y-6">
            <div className="space-y-4">
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="full">Full Payment</option>
                  <option value="half">Half Payment (50% Deposit)</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price per ticket:</span>
                  <span className="font-semibold">${tripDetails.price}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Number of tickets:</span>
                  <span className="font-semibold">{formData.tickets}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Payment type:</span>
                  <span className="font-semibold">
                    {formData.paymentType === "full" ? "Full Payment" : "50% Deposit"}
                  </span>
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Price:</span>
                    <span className="text-xl font-bold text-indigo-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;