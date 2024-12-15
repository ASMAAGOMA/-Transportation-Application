const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        default: "User"
    }],
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    pendingTrips: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'  // Reference to the Trip model
    }]
});

module.exports = mongoose.model('User', userSchema);