const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyJWT = require('../middleware/verifyJWT'); // Your auth middleware

// Apply auth middleware to all routes
router.use(verifyJWT);

// Create booking and initialize Stripe session
router.post("/booking", bookingController.createBookingSession);

// Get all booked trips for the user
router.get("/booked-trips", bookingController.getBookedTrips);

// Get specific booking details
router.get("/booking/:bookingId", bookingController.getBooking);

// Update booking status after payment
router.patch("/booking/:bookingId/status", bookingController.updateBookingStatus);

module.exports = router;