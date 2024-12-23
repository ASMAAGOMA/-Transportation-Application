const stripe = require('stripe')(process.env.STRIPE_SECRET);
const BookedTrip = require('../models/BookedTrip');

const bookingController = {
  createBookingSession: async (req, res) => {
    const { tickets, paymentType, totalPrice, tripId, destination } = req.body;
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const amount = Math.round(totalPrice * 100);
      
      const booking = new BookedTrip({
        userId,
        tripId,
        tickets,
        totalPrice,
        paymentType,
        paymentStatus: 'pending',
        bookingDate: new Date()
      });
      
      await booking.save();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: `Trip to ${destination}` },
            unit_amount: amount,
          },
          quantity: tickets,
        }],
        mode: 'payment',
        success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
        cancel_url: 'http://localhost:3000/cancel',
        metadata: {
          bookingId: booking._id.toString()
        }
      });

      await BookedTrip.findByIdAndUpdate(booking._id, {
        stripeSessionId: session.id
      });

      res.json({ paymentUrl: session.url });
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ message: 'Payment failed', error: error.message });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const { sessionId, bookingId } = req.body;
      
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ message: 'Payment not completed' });
      }

      const booking = await BookedTrip.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      booking.paymentStatus = 'completed';
      await booking.save();

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBookedTrips: async (req, res) => {
    try {
      const userId = req.user?.id;
      const trips = await BookedTrip.find({ 
        userId, 
        paymentStatus: 'completed' 
      }).populate('tripId');
      
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = bookingController;