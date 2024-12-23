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