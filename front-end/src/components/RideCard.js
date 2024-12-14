import React from 'react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, PlusCircle } from 'lucide-react';

const RideCard = ({ trip, onClick, onAddToPending, onBook }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [addPendingTrip] = useAddPendingTripMutation();

  const handleAddToPending = async (e) => {
    e.stopPropagation();
    try {
      await addPendingTrip(trip.id).unwrap();
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      if (onAddToPending) onAddToPending(trip);
    } catch (err) {
      console.error('Failed to add trip to pending:', err);
    }
  };

  return (
    <div 
      className="relative bg-white rounded-lg shadow-md overflow-hidden group"
    >
      <div onClick={onClick} className="cursor-pointer">
        <img 
          src={trip.image ? `http://localhost:3500/uploads/${trip.image}` : '/images/default-trip.jpg'}
          alt={trip.destination}
          className="w-full h-48 object-cover"
        />
        
        {isUpcoming && (
        <button
          onClick={handleAddToPending}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
          title="Add to pending trips"
        >
          <PlusCircle className="w-6 h-6 text-indigo-600" />
        </button>
      )}

      {showNotification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          Added to pending trips!
        </div>
      )}

        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">{trip.destination}</h3>
            <span className="text-lg font-bold text-indigo-600">${trip.price}</span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{trip.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(trip.startDate), 'PPP')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{trip.duration} hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Book button section */}
      <div className="p-4 pt-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(trip);
          }}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RideCard