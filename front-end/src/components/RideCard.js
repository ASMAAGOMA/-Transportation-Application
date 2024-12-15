import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUserPendingTrips } from '../features/auth/authSlice';
import { useAddPendingTripMutation, useRemovePendingTripMutation } from '../features/auth/authApiSlice';

const RideCard = ({ trip, onClick, isPending, showRemoveButton }) => {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    
    const [addPending] = useAddPendingTripMutation();
    const [removePending] = useRemovePendingTripMutation();

    const isPendingTrip = useMemo(() => 
        user?.pendingTrips?.includes(trip._id), // Updated to use _id
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
          } else {
              console.log('Adding trip with ID:', trip._id); // Add this log
              result = await addPending(trip._id).unwrap();
          }
          
          console.log('Mutation result:', result); // Add this log
          
          // Update the user's pending trips in the Redux store
          if (user && user.pendingTrips) {
              const updatedPendingTrips = isPendingTrip
                  ? user.pendingTrips.filter(id => id !== trip._id)
                  : [...user.pendingTrips, trip._id];
              dispatch(updateUserPendingTrips(updatedPendingTrips));
          }
      } catch (err) {
          console.error('Failed to update pending trip:', err);
          console.error('Error details:', {
              status: err.status,
              data: err.data,
              message: err.message
          });
          alert(`Failed to update pending trip: ${err.data?.message || 'Unknown error'}`);
      }
  };

    const formattedDate = new Date(trip.startDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long'
    });

    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onClick && onClick(trip)}
        >
            <div className="relative">
                <img 
                    src={trip.image ? `http://localhost:3500/uploads/${trip.image}` : '/images/default-trip.jpg'}
                    alt={`${trip.origin} to ${trip.destination}`}
                    className="w-full h-48 object-cover"
                />
                <button 
                    className={`absolute top-4 right-4 p-2 rounded-full 
                        ${isPendingTrip ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                    onClick={handlePendingClick}
                >
                    {isPendingTrip ? 'Pending' : 'Add to Pending'}
                </button>
            </div>
            
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{trip.destination}</h3>
                    <span className="text-gray-600">${trip.price}</span>
                </div>
                
                <div className="text-gray-600 mb-2">
                    <p>From: {trip.origin}</p>
                    <p>Date: {formattedDate}</p>
                    <p>Duration: {trip.duration} days</p>
                </div>

                {showRemoveButton && isPending && (
                    <button
                        onClick={handlePendingClick}
                        className="mt-2 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        Remove from Pending
                    </button>
                )}
            </div>
        </div>
    );
};

export default RideCard;