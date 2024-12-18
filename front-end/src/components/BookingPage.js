import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import '../App.css';

//for trip data from home page
const BookingPage = () => {
  const location = useLocation();
  const tripDetails = location.state; 

  if (!tripDetails) {
    return <p className="text-center text-red-500 mt-10">Trip details not available. Please go back and try again.</p>;
  }
  

  const [formData, setFormData] = useState({
    tickets: 1,
    paymentType: "full", // full or half
    
  });

  const totalPrice = formData.paymentType === "full" 
    ? Math.round(tripDetails.price * formData.tickets ) 
    : Math.round((tripDetails.price * formData.tickets ) / 2);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ ...formData, tripId: tripDetails.id, totalPrice });
  };

  const makePayment = async (e) => {
    e.preventDefault(); // لمنع إعادة تحميل الصفحة
    
    try {
      // Stripe Public Key
      const stripe = await loadStripe("pk_test_51QW3x1HzLvE2BAXyeFXNvnWXKCevhEShDCloQgsmGCy6quNinNw8iAdmEFUzligLxlcOL4J04op5l9l3C0LDOUY000vB7o4VPC");
      
      //the data that is passed to booking api
      const apiURL = "http://localhost:3500/api/booking";
      const payload = {
        tickets: formData.tickets,
        paymentType: formData.paymentType,
        totalPrice: totalPrice,
        tripId: tripDetails.id,
        destination: tripDetails.destination
      };
  
      // إرسال البيانات إلى الـ backend
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      // التحقق من الرد
      if (!response.ok) {
        throw new Error("Failed to process payment");
      }
  
      // استخراج الـ paymentUrl من الرد
      const data = await response.json();
      const { paymentUrl } = data;
  
      if (paymentUrl) {
        // إعادة توجيه المستخدم إلى صفحة الدفع الخاصة بـ Stripe
        window.location.href = paymentUrl;
      } else {
        console.error("Payment URL not found");
      }
    } catch (error) {
      console.error("Error during payment:", error.message);
    }
  };  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Container */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        {/* Trip Details */}
        <div className="text-center mb-6">
          {/*Trip image*/}
          {/* <img
            src={tripDetails.image} 
            alt="Trip"
            className="w-full max-h-64 object-cover rounded-lg mb-4"
          /> */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking for: {tripDetails.destination}
          </h1>
          <p className="text-gray-600">Price per ticket: ${tripDetails.price}</p>
          <p className="text-gray-600">Origin: {tripDetails.origin}</p>
          <p className="text-gray-600">Start Date: {tripDetails.startDate}</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-4 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 gap-4">
            {/* Number of Tickets */}
            <label className="block">
              <span className="text-gray-700">Number of Tickets:</span>
              <input
                type="number"
                name="tickets"
                value={formData.tickets}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              />
            </label>

            {/* Payment Type */}
            <label className="block">
              <span className="text-gray-700">Payment Type:</span>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              >
                <option value="full">Full Payment</option>
                <option value="half">Half Payment</option>
              </select>
            </label>

            {/* Total Price */}
            <label className="block">
              <span className="text-gray-700">Total Price:</span>
              <div className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100">
                ${totalPrice.toFixed(2)}
              </div>
            </label>
          </div>
          
          {/* Submit Button */}
          <button
            onClick={makePayment}
            type="submit"
            className="w-full mt-6 bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
