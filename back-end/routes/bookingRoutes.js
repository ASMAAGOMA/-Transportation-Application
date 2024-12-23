const express = require('express');
const router = express.Router();
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