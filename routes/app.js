const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.json({ user: req.user });
});

// Profile page
router.get('/profile', (req, res) => {
  if (req.user) {
    res.json( { user: req.user });
  } else {
    res.redirect('/login');
  }
});

// Login page
router.get('/login', (req, res) => {
  res.send('login');
});

module.exports = router;
