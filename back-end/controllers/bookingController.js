const BookedTrip = require("../models/BookedTrip"); // Adjust path as necessary

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const bookingController = {
  createBookingSession: async (req, res) => {
    const { tickets, paymentType, totalPrice, tripId, destination } = req.body;
    
    try {
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
        userId: req.user._id,
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
      res.status(500).json({ message: "Payment failed", error: error.message });
    }
  },
};

module.exports = bookingController;
