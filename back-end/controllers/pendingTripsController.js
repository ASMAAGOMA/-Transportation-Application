const User = require('../models/User');
const Trip = require('../models/Trip');
const asyncHandler = require('express-async-handler');

const getPendingTrips = asyncHandler(async (req, res) => {
    try {
        // Debug log for incoming request
        console.log('Getting pending trips for user:', req.user._id);

        // First, verify the user exists without population
        const userExists = await User.findById(req.user._id);
        if (!userExists) {
            console.error('User not found:', req.user._id);
            return res.status(404).json({ message: 'User not found' });
        }

        // Debug log user data
        console.log('User found:', {
            id: userExists._id,
            pendingTripsCount: userExists.pendingTrips?.length || 0
        });

        // Attempt to populate pending trips with error handling
        const populatedUser = await User.findById(req.user._id)
            .populate({
                path: 'pendingTrips',
                model: 'Trip',
                select: '-__v' // Exclude version key
            })
            .lean() // Convert to plain JavaScript object
            .exec();

        if (!populatedUser.pendingTrips) {
            console.log('No pending trips array found, initializing empty array');
            populatedUser.pendingTrips = [];
        }

        // Transform the trips data
        const pendingTrips = populatedUser.pendingTrips.map(trip => ({
            id: trip._id.toString(),
            title: trip.title || 'Untitled Trip',
            description: trip.description || '',
            date: trip.date || null,
            // Add any other fields you need
        }));

        console.log(`Successfully retrieved ${pendingTrips.length} pending trips`);
        return res.json(pendingTrips);

    } catch (error) {
        console.error('Error in getPendingTrips:', {
            error: error.message,
            stack: error.stack,
            userId: req.user?._id
        });
        return res.status(500).json({
            message: 'Failed to retrieve pending trips',
            error: error.message
        });
    }
});

// Schema validation middleware
const validateTrip = (req, res, next) => {
    const { tripId } = req.body;
    if (!tripId || !tripId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            message: 'Invalid trip ID format'
        });
    }
    next();
};

const addPendingTrip = [
    validateTrip,
    asyncHandler(async (req, res) => {
        try {
            const { tripId } = req.body;
            console.log('Adding pending trip:', { userId: req.user._id, tripId });

            // Verify trip exists
            const trip = await Trip.findById(tripId);
            if (!trip) {
                return res.status(404).json({ message: 'Trip not found' });
            }

            // Update user's pending trips
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { $addToSet: { pendingTrips: tripId } }, // Use addToSet to prevent duplicates
                { new: true }
            ).populate('pendingTrips');

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            const pendingTrips = updatedUser.pendingTrips.map(trip => ({
                id: trip._id.toString(),
                title: trip.title || 'Untitled Trip',
                // Add other necessary fields
            }));

            return res.json(pendingTrips);

        } catch (error) {
            console.error('Error in addPendingTrip:', {
                error: error.message,
                stack: error.stack,
                userId: req.user?._id
            });
            return res.status(500).json({
                message: 'Failed to add pending trip',
                error: error.message
            });
        }
    })
];
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