import React from 'react';
import { useSelector } from 'react-redux';
import { useGetTripsQuery } from '../features/trips/tripsApiSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import RideCard from './RideCard';

const PendingTrips = () => {
    const user = useSelector(selectCurrentUser);
    const { data: trips, isLoading, isError, error } = useGetTripsQuery();

    // Add some console logs for debugging
    console.log('User Pending Trips:', user?.pendingTrips);
    console.log('All Trips:', trips);

    // Modify the filtering to be more robust
    const pendingTrips = user?.pendingTrips?.length && trips
        ? user.pendingTrips
            .map(pendingTripId => 
                trips.ids
                    .map(id => trips.entities[id])
                    .find(trip => trip._id === pendingTripId)
            )
            .filter(trip => trip !== undefined)
        : [];

    console.log('Filtered Pending Trips:', pendingTrips);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <p>Loading your pending trips...</p>
        </div>;
    }

    if (isError) {
        return <div className="flex justify-center items-center min-h-screen">
            <p className="text-red-500">Error: {error?.data?.message || 'Failed to load pending trips'}</p>
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Pending Trips</h1>
            
            {pendingTrips.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">You haven't added any trips to your pending list yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingTrips.map(trip => (
                        <RideCard
                            key={trip._id}
                            trip={trip}
                            isPending={true}
                            showRemoveButton={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingTrips;