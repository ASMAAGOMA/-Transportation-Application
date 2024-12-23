const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyJWT = require('../middleware/verifyJWT');

// Error handling middleware specific to booking routes
const handleBookingError = (err, req, res, next) => {
  console.error('Booking error:', err);
  
  if (err.type === 'StripeCardError') {
    return res.status(400).json({ 
      message: 'Payment failed', 
      error: err.message 
    });
  }
  
  if (err.type === 'StripeInvalidRequestError') {
    return res.status(400).json({ 
      message: 'Invalid payment request', 
      error: err.message 
    });
  }
  
  next(err);
};

// Apply auth middleware to all routes
router.use(verifyJWT);

// Create booking and initialize Stripe session
router.post('/api/booking', 
  async (req, res, next) => {
    try {
      await bookingController.createBookingSession(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Get all booked trips for the user
router.get("/booked-trips", 
  async (req, res, next) => {
    try {
      await bookingController.getBookedTrips(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Get specific booking details
router.get("/booking/:bookingId", 
  async (req, res, next) => {
    try {
      await bookingController.getBooking(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Update booking status after payment
router.patch("/booking/:bookingId/status", 
  async (req, res, next) => {
    try {
      await bookingController.updateBookingStatus(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Apply error handling middleware
router.use(handleBookingError);

module.exports = router;