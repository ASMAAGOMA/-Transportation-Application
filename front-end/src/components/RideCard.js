import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, PlusCircle, Check } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUserPendingTrips } from '../features/auth/authSlice';
import { useAddPendingTripMutation, useRemovePendingTripMutation } from '../features/auth/authApiSlice';

const RideCard = ({ trip, onClick, onBook }) => {
  const [isPendingAdded, setIsPendingAdded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  
  const [addPending] = useAddPendingTripMutation();
  const [removePending] = useRemovePendingTripMutation();

  const isUpcoming = new Date(trip.startDate) > new Date();
  const navigate = useNavigate();   //Aisha

  const handleBooking = () => {
    console.log('Trip data being passed:', trip);
    navigate('/booking', { state: { ...trip, image: trip.image } }); // pass data 
  };

  const isPendingTrip = useMemo(() => 
    user?.pendingTrips?.includes(trip._id), 
    [user, trip._id]
  );

  const handlePendingClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert("You must be logged in to add trips to pending.");
      return;
    }

    try {
      let result;
      if (isPendingTrip) {
        result = await removePending(trip._id).unwrap();
        dispatch(updateUserPendingTrips(
          user.pendingTrips.filter(id => id !== trip._id)
        ));
      } else {
        result = await addPending(trip._id).unwrap();
        dispatch(updateUserPendingTrips([
          ...(user.pendingTrips || []), 
          trip._id
        ]));
        
        // Show temporary "Added to Pending" message
        setIsPendingAdded(true);
        setTimeout(() => setIsPendingAdded(false), 2000);
      }
    } catch (err) {
      console.error('Failed to update pending trip:', err);
      alert(`Failed to update pending trip: ${err.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden group">
      {/* Pending Added Notification */}
      {isPendingAdded && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-50">
          <Check className="w-5 h-5" />
          Trip Added to Pending
        </div>
      )}

      {/* Position the pending button absolutely within the image container */}
      <div className="relative">
        <img 
          src={trip.image ? `http://localhost:3500/uploads/${trip.image}` : '/images/default-trip.jpg'}
          alt={trip.destination}
          className="w-full h-48 object-cover"
        />
        
        {isUpcoming && (
          <div 
            className="absolute top-2 right-2"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button
              onClick={handlePendingClick}
              className={`rounded-full p-2 shadow-lg transition-colors 
                ${isPendingTrip 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-indigo-600 opacity-0 group-hover:opacity-100'}`}
            >
              {isPendingTrip ? <Check className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
            </button>
            
            {showTooltip && !isPendingTrip && (
              <div className="absolute top-full mt-2 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-md">
                Add to Pending
              </div>
            )}
          </div>
        )}
      </div>

      <div onClick={onClick} className="cursor-pointer">
        <div className="p-4">
          {/* Rest of the card content remains the same */}
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
            handleBooking(); //to transfer it to booking page
          }}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RideCard;