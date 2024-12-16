import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, PlusCircle, Check } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUserPendingTrips } from '../features/auth/authSlice';
import { useAddPendingTripMutation, useRemovePendingTripMutation } from '../features/auth/authApiSlice';

const TripModal = ({ trip, onClose, onBook }) => {
  const [isPendingAdded, setIsPendingAdded] = useState(false);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  
  const [addPending] = useAddPendingTripMutation();
  const [removePending] = useRemovePendingTripMutation();

  // Fix useMemo to always return a boolean
  const isPendingTrip = useMemo(() => {
    return trip && user?.pendingTrips ? user.pendingTrips.includes(trip._id) : false;
  }, [user, trip]);

  // Early return if trip is null
  if (!trip) return null;

  const isUpcoming = new Date(trip.startDate) > new Date();

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
        {/* Pending Added Notification */}
        {isPendingAdded && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-50">
            <Check className="w-5 h-5" />
            Trip Added to Pending
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{trip.destination}</h2>
          <div className="flex items-center gap-4">
            {isUpcoming && (
              <button
                onClick={handlePendingClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors 
                  ${isPendingTrip 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                title={isPendingTrip ? 'Remove from Pending' : 'Add to Pending'}
              >
                {isPendingTrip ? (
                  <>
                    <Check className="w-5 h-5" />
                    Pending
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    Add to Pending
                  </>
                )}
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <img 
            src={trip.image ? `http://localhost:3500/uploads/${trip.image}` : '/images/default-trip.jpg'}
            alt={trip.destination}
            className="w-full h-64 object-cover rounded-lg"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">From</h3>
                <p>{trip.origin}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">To</h3>
                <p>{trip.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">Start Date</h3>
                <p>{format(new Date(trip.startDate), 'PPP')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">End Date</h3>
                <p>{format(new Date(trip.endDate), 'PPP')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">Duration</h3>
                <p>{trip.duration} hours</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold">Availability</h3>
                <p>{trip.maxPassengers - (trip.currentPassengers || 0)} seats left</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold flex items-center gap-2">
              Price
              <span className="text-xl text-indigo-600">${trip.price}</span>
            </h3>
          </div>
          
          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="text-gray-600">{trip.description || 'No description available.'}</p>
          </div>
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => onBook(trip)}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Book Now
            </button>
            {isUpcoming && (
              <button
                onClick={handlePendingClick}
                className={`flex-1 py-2 rounded-lg transition-colors 
                  ${isPendingTrip 
                    ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200' 
                    : 'bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50'}`}
              >
                {isPendingTrip ? 'In Pending' : 'Add to Pending'}
              </button>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-4 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripModal;