const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true  // Username is still required
    },
    email: {
        type: String,
        required: true,  // Email is required
        unique: true  // Ensure email uniqueness
    },
    password: {
        type: String,
        required: true  // Password is still required
    },
    roles: [{
        type: String,
        default: "User"  // Default to "User" if not provided
    }],
    active: {
        type: Boolean,
        default: true  // Default to true if not provided
    },
    createdAt: {
        type: Date,
        default: Date.now  // Set the creation date to now by default
    }
});

module.exports = mongoose.model('User', userSchema);
