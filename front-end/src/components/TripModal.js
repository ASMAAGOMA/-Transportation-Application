import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useAddPendingTripMutation } from '../features/trips/tripsApiSlice';

const TripModal = ({ trip, onClose, onBook }) => {
  const [addPendingTrip] = useAddPendingTripMutation();
  const [notification, setNotification] = useState({ visible: false, message: '', type: '' });

  if (!trip) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Trip Not Found</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
          </div>
          <p className="text-gray-600">The trip details could not be loaded. Please try again later.</p>
        </div>
      </div>
    );
  }

  const handleAddToPending = async (e) => {
    e.stopPropagation();
    try {
      await addPendingTrip(trip.id).unwrap();
      setNotification({ visible: true, message: 'Trip added to pending successfully!', type: 'success' });
    } catch (err) {
      setNotification({ visible: true, message: 'Failed to add trip to pending.', type: 'error' });
      console.error('Error adding trip to pending:', err);
    } finally {
      setTimeout(() => setNotification({ visible: false, message: '', type: '' }), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{trip.destination || 'Unknown Destination'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <div className="space-y-4">
          <img
            src={trip.image ? `http://localhost:3500/uploads/${trip.image}` : '/images/default-trip.jpg'}
            alt={trip.destination || 'Default Trip'}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">From</h3>
                <p>{trip.origin || 'Unknown Origin'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">To</h3>
                <p>{trip.destination || 'Unknown Destination'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">Start Date</h3>
                <p>{trip.startDate ? format(new Date(trip.startDate), 'PPP') : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">End Date</h3>
                <p>{trip.endDate ? format(new Date(trip.endDate), 'PPP') : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">Duration</h3>
                <p>{trip.duration ? `${trip.duration} hours` : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">Availability</h3>
                <p>{trip.maxPassengers ? trip.maxPassengers - (trip.currentPassengers || 0) : 'N/A'} seats left</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="text-gray-600">{trip.description || 'No description available.'}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAddToPending}
            className="flex-1 bg-white border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Add to Pending
          </button>
          <button
            onClick={() => onBook(trip)}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Book Now
          </button>
        </div>
        {notification.visible && (
          <div className={`mt-4 p-3 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripModal;
