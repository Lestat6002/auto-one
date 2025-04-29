const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Trimitere email din formularul de contact
router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_TO,
      subject: 'Mesaj contact AUTO ONE',
      text: `Telefon: ${phone}\n\n${message}`
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Nu s-a putut trimite email-ul' });
  }
});

module.exports = router;