// controllers/bookingController.js
const BookedTrip = require('../models/BookedTrip');
const Trip = require('../models/Trip');
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const bookingController = {
  // Create Stripe session and initialize booking
  createBookingSession: async (req, res) => {
    const { tickets, paymentType, totalPrice, tripId, destination } = req.body;
    
    try {
      // Create Stripe session
      const amount = totalPrice * 100; // stripe uses cents
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Trip to ${destination}`,
              },
              unit_amount: amount,
            },
            quantity: tickets,
          },
        ],
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      });

      // Create pending booking
      const booking = new BookedTrip({
        userId: req.user._id, // Assuming you have user info from auth middleware
        tripId,
        tickets,
        totalPrice,
        paymentType,
        stripeSessionId: session.id
      });

      await booking.save();

      res.json({ paymentUrl: session.url, bookingId: booking._id });
    } catch (error) {
      console.error("Payment error:", error);
      res.status(500).send("Payment failed");
    }
  },

  // Get all booked trips for a user
  getBookedTrips: async (req, res) => {
    try {
      const bookedTrips = await BookedTrip.find({ userId: req.user._id })
        .populate('tripId')
        .sort({ bookingDate: -1 });

      res.json(bookedTrips);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update booking status after successful payment
  updateBookingStatus: async (req, res) => {
    try {
      const { bookingId } = req.params;
      
      const booking = await BookedTrip.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Verify payment with Stripe
      const session = await stripe.checkout.sessions.retrieve(booking.stripeSessionId);
      
      if (session.payment_status === 'paid') {
        booking.paymentStatus = 'completed';
        await booking.save();

        // Update trip's passenger count
        await Trip.findByIdAndUpdate(booking.tripId, {
          $inc: { currentPassengers: booking.tickets }
        });

        res.json(booking);
      } else {
        booking.paymentStatus = 'failed';
        await booking.save();
        res.status(400).json({ message: 'Payment not completed' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get booking details
  getBooking: async (req, res) => {
    try {
      const booking = await BookedTrip.findById(req.params.bookingId)
        .populate('tripId');
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = bookingController;