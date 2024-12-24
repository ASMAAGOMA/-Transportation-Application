import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, PlusCircle, Check, Edit, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUserPendingTrips } from '../features/auth/authSlice';
import { useAddPendingTripMutation, useRemovePendingTripMutation, useUpdateTripMutation, useDeleteTripMutation } from '../features/trips/tripsApiSlice';

const RideCard = ({ trip, onClick, onBook }) => {
  const [isPendingAdded, setIsPendingAdded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState(trip);
  
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [addPending] = useAddPendingTripMutation();
  const [removePending] = useRemovePendingTripMutation();
  const [updateTrip] = useUpdateTripMutation();
  const [deleteTrip] = useDeleteTripMutation();

  // Define admin emails
  const adminEmails = ['asmaagadallaah@gmail.com', 'asmaaGad@gmail.com', 'abrargomaa111@gmail.com'];
  
  // Check if current user is admin
  const isAdmin = user && adminEmails.includes(user.email);

  const isUpcoming = new Date(trip.startDate) > new Date();

  const isPendingTrip = useMemo(() => 
    user?.pendingTrips?.includes(trip._id), 
    [user, trip._id]
  );

  const handleBooking = () => {
    navigate('/booking', { state: { ...trip, image: trip.image } });
  };

  const handlePendingClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert("You must be logged in to add trips to pending.");
      return;
    }

    try {
      if (isPendingTrip) {
        await removePending(trip._id).unwrap();
        dispatch(updateUserPendingTrips(
          user.pendingTrips.filter(id => id !== trip._id)
        ));
      } else {
        await addPending(trip._id).unwrap();
        dispatch(updateUserPendingTrips([
          ...(user.pendingTrips || []), 
          trip._id
        ]));
        setIsPendingAdded(true);
        setTimeout(() => setIsPendingAdded(false), 2000);
      }
    } catch (err) {
      console.error('Failed to update pending trip:', err);
      alert(`Failed to update pending trip: ${err.data?.message || 'Unknown error'}`);
    }
  };

  // Admin functions
  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(trip._id).unwrap();
      } catch (err) {
        console.error('Failed to delete trip:', err);
        alert(`Failed to delete trip: ${err.data?.message || 'Unknown error'}`);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTrip({
        id: trip._id,
        ...editedTrip
      }).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update trip:', err);
      alert(`Failed to update trip: ${err.data?.message || 'Unknown error'}`);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={editedTrip.destination}
            onChange={(e) => setEditedTrip({...editedTrip, destination: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Destination"
          />
          <input
            type="text"
            value={editedTrip.origin}
            onChange={(e) => setEditedTrip({...editedTrip, origin: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Origin"
          />
          <input
            type="number"
            value={editedTrip.price}
            onChange={(e) => setEditedTrip({...editedTrip, price: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Price"
          />
          <input
            type="datetime-local"
            value={format(new Date(editedTrip.startDate), "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => setEditedTrip({...editedTrip, startDate: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            value={editedTrip.duration}
            onChange={(e) => setEditedTrip({...editedTrip, duration: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Duration (hours)"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden group">
      {isPendingAdded && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-50">
          <Check className="w-5 h-5" />
          Trip Added to Pending
        </div>
      )}

      <div className="relative">
        <img 
          src={trip.image ? `http://localhost:3500/uploads/${trip.image}` : '/images/default-trip.jpg'}
          alt={trip.destination}
          className="w-full h-48 object-cover"
        />
        
        {/* Admin actions */}
        {isAdmin && (
          <div className="absolute top-2 left-2 flex gap-2">
            <button
              onClick={handleEdit}
              className="rounded-full p-2 bg-white text-blue-600 shadow-lg hover:bg-blue-50"
              title="Edit trip"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="rounded-full p-2 bg-white text-red-600 shadow-lg hover:bg-red-50"
              title="Delete trip"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
        
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

      <div className="p-4 pt-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBooking();
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