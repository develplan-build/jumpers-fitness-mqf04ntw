const express = require('express');
const twilio = require('twilio');
const router = express.Router();

let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

router.post('/send', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'Twilio non configurato' });
  const { to, body } = req.body;
  try {
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;