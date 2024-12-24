const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51QW3x1HzLvE2BAXyzzKfSSl5Bb3E1XEDQy5sap3oGAwNPmQV5KQhFNb0DHLZlFawlXHEAoQ7XiWXq2Mc8BvhXKkr00QuM7Y6ZF');
const notificationController = require('../controllers/notificationController');

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = 'whsec_SrgHP6Z0PSiyyDveNS2gr7D8UtENlp78';

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata.userId;

            await notificationController.createNotification({
                userId,                
                message: 'Tickets are booked successfully!',
                type: 'success',
            });
        }

        if (event.type === 'payment_intent.canceled') {
            const paymentIntent = event.data.object;
            const userId = paymentIntent.metadata.userId;

            await notificationController.createNotification({
                userId,
                message: 'Tickets are cancelled succssfully',
                type: 'info',
            });
        }

        res.status(200).send('Webhook received');
    } catch (err) {
        console.error('Webhook error:', err);
        res.status(400).send(`Webhook error: ${err.message}`);
    }
});

module.exports = router;
