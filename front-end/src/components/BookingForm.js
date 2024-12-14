import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

const BookingForm = ({ trip, onBack }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Handle booking submission here
    console.log('Booking submitted:', { ...data, tripId: trip.id });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Booking Form</h2>
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800"
        >
          Back to Trips
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <img
          src={trip.image || '/images/default-trip.jpg'}
          alt={trip.destination}
          className="rounded-lg col-span-1"
        />
        <div>
          <h3 className="text-xl font-semibold mb-2">{trip.destination}</h3>
          <p className="text-gray-600 mb-4">{trip.description}</p>
          <div className="space-y-2">
            <p><span className="font-medium">Price:</span> ${trip.price}</p>
            <p><span className="font-medium">Duration:</span> {trip.duration} hours</p>
            <p><span className="font-medium">Available Seats:</span> {trip.maxPassengers - (trip.currentPassengers || 0)}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              {...register('firstName', { required: true })}
              className="w-full rounded-lg border-gray-300"
            />
            {errors.firstName && <span className="text-red-500 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              {...register('lastName', { required: true })}
              className="w-full rounded-lg border-gray-300"
            />
            {errors.lastName && <span className="text-red-500 text-sm">Required</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            className="w-full rounded-lg border-gray-300"
          />
          {errors.email && <span className="text-red-500 text-sm">Valid email required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Trip Date</label>
          <input
            type="date"
            {...register('date', { required: true })}
            className="w-full rounded-lg border-gray-300"
          />
          {errors.date && <span className="text-red-500 text-sm">Required</span>}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
