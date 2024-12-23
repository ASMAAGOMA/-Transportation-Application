// models/BookedTrip.js
const mongoose = require('mongoose');

const bookedTripSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  tripId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trip', 
    required: true 
  },
  tickets: { 
    type: Number, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  paymentType: { 
    type: String, 
    enum: ['full', 'half'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  bookingDate: { 
    type: Date, 
    default: Date.now 
  },
  stripeSessionId: { 
    type: String 
  }
});

module.exports = mongoose.model('BookedTrip', bookedTripSchema);