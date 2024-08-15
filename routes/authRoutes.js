const express = require('express');
const passport = require('../config/auth'); //filePath for auth config
const router = express.Router();

// Auth0 routes
router.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), (req, res) => {
    res.redirect('/');
});

router.get('/callback', passport.authenticate('auth0', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=http://localhost:3000`);
});

// Secure route example
function secured(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

router.get('/profile', secured, (req, res) => {
    res.render("profile", { user: req.user });
});

module.exports = router;
