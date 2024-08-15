//auth0
const session = require("express-session");
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const User = require('../models/userSchema'); // Adjust the path as needed

// Auth0 configuration
const auth0Strategy = new Auth0Strategy({
    domain: 'dev-r36sqwzrgh0z56eq.ca.auth0.com',
    clientID: 'DIhQg8ebNlcXkb22eRBgJZgRjlJ4hNP7',
    clientSecret: `M5mOYRVna6vW_psTTiIglyU7KLX0jtVVwK4thjgPssg7MIlyjDLelXVdaWFZwsjc`,
    callbackURL: 'http://localhost:3000/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
    // Here you can save user info to MongoDB if needed
    User.findOneAndUpdate({ auth0Id: profile.id }, {
        auth0Id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
    }, { upsert: true, new: true }, (err, user) => {
        return done(err, user);
    });
});

passport.use(auth0Strategy);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
