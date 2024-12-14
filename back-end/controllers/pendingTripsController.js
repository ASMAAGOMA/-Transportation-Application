const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const getPendingTrips = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('pendingTrips');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.pendingTrips);
});

const addPendingTrip = asyncHandler(async (req, res) => {
    const { tripId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.pendingTrips.includes(tripId)) {
        return res.status(400).json({ message: 'Trip already in pending list' });
    }
    
    user.pendingTrips.push(tripId);
    await user.save();
    
    res.json(user.pendingTrips);
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
    
    res.json(user.pendingTrips);
});

module.exports = {
    getPendingTrips,
    addPendingTrip,
    removePendingTrip
};