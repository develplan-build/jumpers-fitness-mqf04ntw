require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripeRoutes = require('./stripe');
const emailRoutes = require('./email');
const smsRoutes = require('./sms');

const app = express();
const PORT = 4000;

// Stripe webhook richiede il body raw, quindi lo montiamo prima di express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeRoutes.webhookHandler);

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/stripe', stripeRoutes.router);
app.use('/api/email', emailRoutes);
app.use('/api/sms', smsRoutes);

// Endpoint di test/demo
app.get('/api/demo/status', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});