const stripe = require("stripe")(process.env.STRIPE_SECRET);
const BookedTrip = require('../models/BookedTrip');  // Import the BookedTrip model

const bookingController = {
  createBookingSession: async (req, res) => {
    const { tickets, paymentType, totalPrice, tripId, destination } = req.body;
    
    try {
      const amount = totalPrice * 100; // Stripe uses cents
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

      // Ensure the user ID is accessed correctly from the decoded JWT
      const userId = req.user.UserInfo ? req.user.UserInfo.id : null;
      if (!userId) {
        return res.status(400).json({ message: "User ID not found in the request" });
      }

      // Create pending booking
      const booking = new BookedTrip({
        userId,  // Correct userId here
        tripId,
        tickets,
        totalPrice,
        paymentType,
        stripeSessionId: session.id,
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
