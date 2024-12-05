const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    destination: { type: String, required: true },
    origin: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    duration: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, default: '' },  // Added for modal details
    status: { type: String, enum: ['available', 'pending', 'booked'], default: 'available' }, // Added for tracking trip status
    maxPassengers: { type: Number, default: 4 }, // Optional: if you want to track capacity
    currentPassengers: { type: Number, default: 0 } // Optional: to track current bookings
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Trip', tripSchema);