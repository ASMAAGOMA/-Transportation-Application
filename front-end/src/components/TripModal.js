import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, PlusCircle } from 'lucide-react';

const TripModal = ({ trip, onClose, onAddToPending, onBook }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [addPendingTrip] = useAddPendingTripMutation();

  const handleAddToPending = async () => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{trip.destination}</h2>
          <div className="flex items-center gap-4">
            {isUpcoming && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToPending(trip);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                Add to Pending
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
          
          {showNotification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Added to pending trips!
        </div>
      )}
      
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => onBook(trip)}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Book Now
        </button>
        {isUpcoming && (
          <button
            onClick={handleAddToPending}
            className="flex-1 bg-white border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Add to Pending
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
