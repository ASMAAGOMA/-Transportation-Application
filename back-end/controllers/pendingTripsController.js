const mongoose = require('mongoose');
const User = require('../models/User');
const Trip = require('../models/Trip');

// Add this validation helper
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const getPendingTrips = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await User.findById(req.user).populate({
            path: 'pendingTrips',
            model: 'Trip'
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Populated Pending Trips:', user.pendingTrips);
        res.json(user.pendingTrips || [])
    } catch (err) {
        console.error('Error in getPendingTrips:', err);
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
}

const addPendingTrip = async (req, res) => {
    try {
        console.log('Request user object:', req.user);
        console.log('Request body:', req.body);

        // Updated check for user authentication
        if (!req.user || !req.user._id) {
            console.log('User authentication failed:', req.user);
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { tripId } = req.body;
        
        if (!tripId) {
            return res.status(400).json({ message: 'Trip ID is required' });
        }

        if (!isValidObjectId(tripId)) {
            return res.status(400).json({ message: 'Invalid Trip ID format' });
        }

        // Using _id from the updated user object
        const user = await User.findById(req.user._id);
        if (!user) {
            console.log('User not found in database:', req.user._id);
            return res.status(404).json({ message: 'User not found' });
        }

        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Initialize pendingTrips if needed
        if (!user.pendingTrips) {
            user.pendingTrips = [];
        }

        // Check if trip is already in pending trips
        if (user.pendingTrips.includes(tripId)) {
            return res.json(user.pendingTrips);
        }

        user.pendingTrips.push(tripId);
        await user.save();

        const updatedUser = await User.findById(req.user._id).populate('pendingTrips');
        res.json(updatedUser.pendingTrips);
    } catch (err) {
        console.error('Error in addPendingTrip:', err);
        res.status(500).json({ 
            message: 'Server Error', 
            error: err.message 
        });
    }
};
const removePendingTrip = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tripId = req.params.tripId;
        if (!tripId) {
            return res.status(400).json({ message: 'Trip ID is required' });
        }

        // Add MongoDB ObjectId validation
        if (!isValidObjectId(tripId)) {
            return res.status(400).json({ message: 'Invalid Trip ID format' });
        }

        const tripIndex = user.pendingTrips.indexOf(tripId);
        if (tripIndex === -1) {
            return res.status(400).json({ message: 'Trip not in pending trips' });
        }

        user.pendingTrips.splice(tripIndex, 1);
        await user.save();

        // Return the updated pending trips list
        const updatedUser = await User.findById(req.user).populate('pendingTrips');
        res.json(updatedUser.pendingTrips);
    } catch (err) {
        console.error('Error in removePendingTrip:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

module.exports = {
    getPendingTrips,
    addPendingTrip,
    removePendingTrip
};