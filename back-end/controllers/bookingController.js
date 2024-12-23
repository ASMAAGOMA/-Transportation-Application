const stripe = require('stripe')(process.env.STRIPE_SECRET);
const BookedTrip = require('../models/BookedTrip'); // Adjust the path to your model

const bookingController = {
  createBookingSession: async (req, res) => {
    const { tickets, paymentType, totalPrice, tripId, destination } = req.body;

    try {
      // Get userId from the authenticated request
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized - Please log in' });
      }

      // Validate required fields
      if (!tickets || !paymentType || !totalPrice || !tripId || !destination) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Convert totalPrice to cents for Stripe
      const amount = Math.round(totalPrice * 100);

      // Create a Stripe checkout session
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
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });

      // Save booking with a pending status
      const booking = new BookedTrip({
        userId,
        tripId,
        tickets,
        totalPrice,
        paymentType,
        stripeSessionId: session.id,
      });

      await booking.save();

      // Respond with the Stripe session URL
      res.json({ paymentUrl: session.url, bookingId: booking._id });
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ message: 'Payment failed', error: error.message });
    }
  },
};

module.exports = bookingController;
