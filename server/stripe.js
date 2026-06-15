const express = require('express');
const Stripe = require('stripe');
const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

router.post('/checkout', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe non configurato: aggiungi STRIPE_SECRET_KEY' });
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl || 'http://localhost:3000/billing?success=true',
      cancel_url: cancelUrl || 'http://localhost:3000/billing?canceled=true',
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const webhookHandler = async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).send('Stripe non configurato');
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === 'checkout.session.completed') {
    console.log('Payment successful:', event.data.object);
    // Qui andrebbe la logica per aggiornare il database (es. Supabase)
  }
  if (event.type === 'customer.subscription.deleted') {
    console.log('Subscription canceled:', event.data.object);
  }
  
  res.json({ received: true });
};

module.exports = { router, webhookHandler };