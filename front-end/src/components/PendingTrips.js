import React, { useState } from 'react';
import { useGetPendingTripsQuery, useRemovePendingTripMutation } from '../features/trips/tripsApiSlice';
import { Search } from 'lucide-react';

const PendingTrips = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState(1000);
    const [duration, setDuration] = useState(30);
    const [selectedTypes, setSelectedTypes] = useState([]);
    
    const { data: pendingTrips, isLoading, isError, error } = useGetPendingTripsQuery();
    const [removePendingTrip] = useRemovePendingTripMutation();

    const handleRemoveTrip = async (tripId) => {
        try {
            await removePendingTrip(tripId).unwrap();
        } catch (err) {
            console.error('Failed to remove trip:', err);
        }
    };

    const filteredTrips = pendingTrips?.ids
        ?.map(id => pendingTrips.entities[id])
        ?.filter(trip => {
            const matchesSearch = trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPrice = trip.price <= priceRange;
            const matchesDuration = trip.duration <= duration;
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(trip.type);
            return matchesSearch && matchesPrice && matchesDuration && matchesType;
        });

    if (isLoading) return <div className="p-4">Loading pending trips...</div>;
    if (isError) return <div className="p-4 text-red-500">Error: {error?.data?.message}</div>;

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-4 gap-6">
                {/* Filters Section */}
                <div className="col-span-1 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Filters</h2>
                    
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search destination..."
                                className="pl-10 w-full rounded-md border border-gray-300 p-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Price Range (${priceRange})
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Duration (up to {duration} days)
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="90"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Trip Type</label>
                            <div className="space-y-2">
                                {['Adventure', 'Relaxation'].map(type => (
                                    <label key={type} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedTypes.includes(type)}
                                            onChange={() => {
                                                setSelectedTypes(prev =>
                                                    prev.includes(type)
                                                        ? prev.filter(t => t !== type)
                                                        : [...prev, type]
                                                );
                                            }}
                                            className="mr-2"
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trips Grid */}
                <div className="col-span-3">
                    <h1 className="text-2xl font-bold mb-6">My Pending Trips</h1>
                    {filteredTrips?.length === 0 ? (
                        <p>No pending trips found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTrips?.map(trip => (
                                <div 
                                    key={trip.id} 
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <img
                                        src={trip.image ? `/trips/${trip.id}/image` : '/placeholder-trip.jpg'}
                                        alt={trip.destination}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-red-600">{trip.destination}</h3>
                                        <p className="text-gray-600">From {trip.origin}</p>
                                        <p className="text-gray-800 font-bold mt-2">${trip.price}</p>
                                        <p className="text-gray-600 text-sm">
                                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                        </p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <button
                                                onClick={() => handleRemoveTrip(trip.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                            <button
                                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingTrips;