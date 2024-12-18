const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

router.post("/booking", async (req, res) => {
    const { tickets, paymentType,totalPrice, tripId, destination } = req.body;
    try {
      // stripe use cents
      const amount= totalPrice*100;

  
      // start session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Trip ${tripId}`,
              },
              unit_amount: amount , 
            },
            quantity: tickets,
          },
        ],
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      });
  
      res.json({ paymentUrl: session.url });
    } catch (error) {
      console.error("Payment error:", error);
      res.status(500).send("Payment failed");
    }
  });

module.exports = router
