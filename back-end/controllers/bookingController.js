const stripe = require('stripe')(process.env.STRIPE_SECRET);
const BookedTrip = require('../models/BookedTrip');

const bookingController = {
  createBookingSession: async (req, res) => {
    const { tickets, paymentType, totalPrice, tripId, destination } = req.body;

    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized - Please log in' });
      }

      if (!tickets || !paymentType || !totalPrice || !tripId || !destination) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const amount = Math.round(totalPrice * 100);

      // Create booking first to get the booking ID
      const booking = new BookedTrip({
        userId,
        tripId,
        tickets,
        totalPrice,
        paymentType,
      });
      
      await booking.save();

      // Create Stripe session with booking ID in success URL
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Trip to ${destination}`,
              },
              unit_amount: amount,
            },
            quantity: tickets,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/success?booking_id=${booking._id}`,
        cancel_url: 'http://localhost:3000/cancel',
        metadata: {
          bookingId: booking._id.toString()
        }
      });

      // Update booking with session ID
      await BookedTrip.findByIdAndUpdate(booking._id, {
        stripeSessionId: session.id
      });

      res.json({ paymentUrl: session.url, bookingId: booking._id });
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ message: 'Payment failed', error: error.message });
    }
  },
};

// Add to bookingController.js
verifyPayment: async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required' });
      }
  
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Payment session not found' });
      }
  
      const booking = await BookedTrip.findOne({ stripeSessionId: sessionId });
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      booking.paymentStatus = 'completed';
      await booking.save();
  
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

module.exports = bookingController;