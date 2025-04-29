const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login admin
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credențiale invalide' });
  }
});

// Validare token - pentru frontend să valideze sesiunea
router.get('/validate', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Middleware autentificare JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.authenticateToken = authenticateToken;
module.exports = router;