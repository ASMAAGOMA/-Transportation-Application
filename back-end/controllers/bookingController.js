const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bookingController = {
    createBookingSession: async (req, res) => {
      const { tickets, paymentType, totalPrice, tripId, destination } = req.body;
      
      try {
        // Get userId from the authenticated request
        const userId = req.user?.id;
        if (!userId) {
          return res.status(401).json({ message: "Unauthorized - Please log in" });
        }
        if (!tickets || !paymentType || !totalPrice || !tripId || !destination) {
            return res.status(400).json({ message: "Missing required fields" });
          }
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
  
        // Create pending booking
        const booking = new BookedTrip({
          userId,
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
