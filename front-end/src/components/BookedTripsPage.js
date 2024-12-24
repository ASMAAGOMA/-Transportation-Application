import React, { useState, useEffect } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';

const BookedTripsPage = () => {
  const [bookedTrips, setBookedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('recent');
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const fetchBookedTrips = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/booked-trips', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booked trips');
        }

        const data = await response.json();
        setBookedTrips(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching booked trips:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBookedTrips();
    }
  }, [token]);

  const categorizeTrips = (trips) => {
    const now = new Date();
    const weekAgo = subDays(now, 7);
    const monthAgo = subMonths(now, 1);

    return {
      recent: trips.filter(trip => new Date(trip.bookingDate) >= subDays(now, 2)),
      week: trips.filter(
        trip =>
          new Date(trip.bookingDate) >= weekAgo && new Date(trip.bookingDate) < subDays(now, 2)
      ),
      month: trips.filter(
        trip =>
          new Date(trip.bookingDate) >= monthAgo && new Date(trip.bookingDate) < weekAgo
      ),
      older: trips.filter(trip => new Date(trip.bookingDate) < monthAgo)
    };
  };

  const categorizedTrips = categorizeTrips(bookedTrips);

  const TabButton = ({ label, count, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-lg transition-all ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label} ({count})
    </button>
  );

  const TripCard = ({ trip }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={trip.image ? `http://localhost:3500/uploads/${trip.image}` : '/images/default-trip.jpg'}
        alt={trip.destination}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
          <h3 className="text-lg font-semibold mb-1 sm:mb-0">{trip.destination}</h3>
          <span className="text-sm text-gray-500">
            Booked: {format(new Date(trip.bookingDate), 'PPP')}
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>From: {trip.origin}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>{format(new Date(trip.startDate), 'PPP')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>{trip.duration} hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>{trip.tickets} tickets</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total paid:</span>
            <span className="text-lg font-semibold text-indigo-600">
              ${trip.totalPaid}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booked Trips</h1>
          <div className="flex gap-4">
            {['recent', 'week', 'month', 'older'].map(tab => (
              <TabButton 
                key={tab}
                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                count={categorizedTrips[tab].length}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorizedTrips[activeTab].map((trip, index) => (
            <TripCard key={index} trip={trip} />
          ))}
        </div>

        {categorizedTrips[activeTab].length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No trips found</h3>
            <p className="mt-2 text-sm text-gray-500">
              You don't have any booked trips in this time period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedTripsPage;
