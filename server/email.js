const express = require('express');
const sgMail = require('@sendgrid/mail');
const router = express.Router();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

router.post('/send', async (req, res) => {
  if (!process.env.SENDGRID_API_KEY) return res.status(503).json({ error: 'SendGrid non configurato' });
  const { to, subject, html } = req.body;
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM || 'noreply@jumpersfitness.com',
      subject,
      html,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;