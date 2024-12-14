import React from 'react';

const BookingForm = ({ trip, onBack }) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-sm space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Booking Form</h2>
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800"
        >
          Back to Trips
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          className="p-3 rounded-lg border border-gray-200 w-full"
        />
        <input
          type="text"
          placeholder="Last Name"
          className="p-3 rounded-lg border border-gray-200 w-full"
        />
      </div>
      <input
        type="email"
        placeholder="Email Address"
        className="p-3 rounded-lg border border-gray-200 w-full"
      />
      <input
        type="text"
        placeholder="YYYY-MM-DD"
        className="p-3 rounded-lg border border-gray-200 w-full"
      />
      <button className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors">
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingForm;