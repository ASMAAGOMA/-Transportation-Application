const User = require('../models/User');
const Trip = require('../models/Trip'); // Add this import
const asyncHandler = require('express-async-handler');

const getPendingTrips = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'pendingTrips',
            model: 'Trip'
        });

        if (!user) {
            console.error(`User not found with ID: ${req.user._id}`);
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.pendingTrips || !Array.isArray(user.pendingTrips)) {
            console.warn(`No pending trips found for user: ${req.user._id}`);
            return res.json([]); // Return empty array instead of error
        }

        // Transform and validate each trip
        const pendingTrips = user.pendingTrips
            .filter(trip => trip && trip._id) // Filter out any null or invalid trips
            .map(trip => ({
                ...trip.toObject(),
                id: trip._id.toString(), // Ensure ID is a string
                // Add any required default values
                title: trip.title || 'Untitled Trip',
                // Add other necessary fields with defaults
            }));

        console.log(`Successfully retrieved ${pendingTrips.length} pending trips for user ${req.user._id}`);
        res.json(pendingTrips);
    } catch (error) {
        console.error('Error in getPendingTrips:', error);
        res.status(500).json({ message: 'Error retrieving pending trips', error: error.message });
    }
});
const addPendingTrip = asyncHandler(async (req, res) => {
    const { tripId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Verify the trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
    }

    if (user.pendingTrips.includes(tripId)) {
        return res.status(400).json({ message: 'Trip already in pending list' });
    }
    
    user.pendingTrips.push(tripId);
    await user.save();
    
    // Return the full pending trips list
    const updatedUser = await User.findById(req.user._id).populate('pendingTrips');
    const pendingTrips = updatedUser.pendingTrips.map(trip => ({
        ...trip.toObject(),
        id: trip._id
    }));
    res.json(pendingTrips);
});

const removePendingTrip = asyncHandler(async (req, res) => {
    const { tripId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const tripIndex = user.pendingTrips.indexOf(tripId);
    if (tripIndex === -1) {
        return res.status(400).json({ message: 'Trip not in pending list' });
    }
    
    user.pendingTrips.splice(tripIndex, 1);
    await user.save();
    
    // Return the updated pending trips list
    const updatedUser = await User.findById(req.user._id).populate('pendingTrips');
    const pendingTrips = updatedUser.pendingTrips.map(trip => ({
        ...trip.toObject(),
        id: trip._id
    }));
    res.json(pendingTrips);
});

module.exports = {
    getPendingTrips,
    addPendingTrip,
    removePendingTrip
};