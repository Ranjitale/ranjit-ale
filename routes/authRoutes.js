const express = require('express');
const passport = require('passport');
const router = express.Router();

// Redirect to Google for authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/profile');
});

// Log out user
router.get('/logout', (req, res) => {
  req.logout(() => {
    
  });
  res.redirect('/');
});

module.exports = router;
