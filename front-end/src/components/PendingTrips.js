import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { BookmarkX, MapPin, Calendar, Sparkles } from 'lucide-react';
import { useGetTripsQuery } from '../features/trips/tripsApiSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import RideCard from './RideCard';
import TripModal from './TripModal'; // Make sure to import the TripModal

const PendingTrips = () => {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const user = useSelector(selectCurrentUser);
    const { data: trips, isLoading, isError, error } = useGetTripsQuery();
    const navigate = useNavigate();

    const pendingTrips = user?.pendingTrips?.length && trips
        ? user.pendingTrips
            .map(pendingTripId => 
                trips.ids
                    .map(id => trips.entities[id])
                    .find(trip => trip._id === pendingTripId)
            )
            .filter(trip => trip !== undefined)
        : [];

    const handleOpenModal = (trip) => {
        setSelectedTrip(trip);
    };

    const handleCloseModal = () => {
        setSelectedTrip(null);
    };

    const handleBookTrip = (trip) => {
        // Implement booking logic here
        console.log('Booking trip:', trip);
        // You might want to open a booking modal or navigate to a booking page
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-indigo-300 rounded-full"></div>
                    <p className="text-xl text-gray-600">Loading your pending adventures...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <BookmarkX className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 text-xl">
                        {error?.data?.message || 'Something went wrong loading your trips'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 relative">
            {/* Existing component code */}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        My Pending Trips
                    </h1>
                    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">
                            {pendingTrips.length} Upcoming Adventures
                        </span>
                    </div>
                </div>
                
                {pendingTrips.length === 0 ? (
                    <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-12 text-center">
                        <MapPin className="w-24 h-24 text-gray-300 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            No Pending Trips Yet
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Start exploring and add some exciting destinations to your pending list!
                        </p>
                        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                                onClick={() => navigate("/")}
                        >
                            Explore Trips
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pendingTrips.map(trip => (
                            <div 
                                key={trip._id} 
                                className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                onClick={() => handleOpenModal(trip)}
                            >
                                <RideCard
                                    trip={trip}
                                    isPending={true}
                                    showRemoveButton={true}
                                    onClick={() => handleOpenModal(trip)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 inline-flex items-center space-x-4">
                        <Calendar className="w-8 h-8 text-indigo-600" />
                        <p className="text-gray-700">
                            Keep track of your upcoming adventures and plan your next journey!
                        </p>
                    </div>
                </div>
            </div>

            {/* Trip Modal */}
            {selectedTrip && (
                <TripModal 
                    trip={selectedTrip}
                    onClose={handleCloseModal}
                    onBook={handleBookTrip}
                />
            )}
        </div>
    );
};

export default PendingTrips;