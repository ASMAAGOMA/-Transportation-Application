const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyJWT = require('../middleware/verifyJWT');

const handleBookingError = (err, req, res, next) => {
  console.error('Booking error:', err);
  
  if (err.type === 'StripeCardError') {
    return res.status(400).json({ message: 'Payment failed', error: err.message });
  }
  
  if (err.type === 'StripeInvalidRequestError') {
    return res.status(400).json({ message: 'Invalid payment request', error: err.message });
  }
  
  next(err);
};

router.use(verifyJWT);

// Payment and Booking Routes
router.post("/booking", async (req, res, next) => {
  try {
    await bookingController.createBookingSession(req, res);
  } catch (err) {
    next(err);
  }
});

router.post("/booking/verify-payment", async (req, res, next) => {
  try {
    await bookingController.verifyPayment(req, res);
  } catch (err) {
    next(err);
  }
});

// Booking Management Routes
router.get("/booked-trips", async (req, res, next) => {
  try {
    await bookingController.getBookedTrips(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/booking/:bookingId", async (req, res, next) => {
  try {
    await bookingController.getBooking(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/booking/session/:sessionId", async (req, res, next) => {
  try {
    await bookingController.getBookingBySession(req, res);
  } catch (err) {
    next(err);
  }
});

router.patch("/booking/:bookingId/status", async (req, res, next) => {
  try {
    await bookingController.updateBookingStatus(req, res);
  } catch (err) {
    next(err);
  }
});

// Payment Webhook Route
router.post("/webhook", express.raw({type: 'application/json'}), async (req, res, next) => {
  try {
    await bookingController.handleStripeWebhook(req, res);
  } catch (err) {
    next(err);
  }
});

router.use(handleBookingError);

module.exports = router;