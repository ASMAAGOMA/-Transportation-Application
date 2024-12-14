// BookingForm.js
import React, { useState } from 'react';

const BookingForm = ({ trip, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    participants: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your booking submission logic here
    console.log('Booking submitted:', { trip, ...formData });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Book {trip.destination}</h2>
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Trips
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Trip Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Number of Participants</label>
          <input
            type="number"
            min="1"
            required
            value={formData.participants}
            onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) })}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;