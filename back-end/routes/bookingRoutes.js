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
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Booking = require("../models/booking"); 

router.post("/booking", async (req, res) => {
    const { tickets, paymentType, totalPrice, tripId, destination } = req.body;
    try {
        const amount = totalPrice * 100;

        // بدء جلسة الدفع
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Trip ${tripId}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: tickets,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:3000/success?tripId=${tripId}`,
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ paymentUrl: session.url });
    } catch (error) {
        console.error("Payment error:", error);
        res.status(500).send("Payment failed");
    }
});

module.exports = router;
// Endpoint to save booking after payment
router.post("/save-booking", async (req, res) => {
  const { tripId, tickets, totalPrice, destination } = req.body;
  try {
      const newBooking = new Booking({
          tripId,
          tickets,
          totalPrice,
          destination,
      });

      // حفظ الحجز في قاعدة البيانات
      await newBooking.save();

      // إرجاع بيانات الحجز للـ Frontend
      res.status(200).json({
          message: "Booking saved successfully",
          booking: {
              tripId: newBooking.tripId,
              tickets: newBooking.tickets,
              totalPrice: newBooking.totalPrice,
              destination: newBooking.destination,
          },
      });
  } catch (error) {
      console.error("Error saving booking:", error);
      res.status(500).send("Error saving booking");
  }
});


module.exports = router;