const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const User = require('../models/User');

// Local strategy - authenticate via email/password
const localLogin = new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) return done(null, false);

    user.comparePassword(password, (err, match) => {
      if (err) return done(err, false);
      if (!match) return done(null, false);

      done(null, user);
    });
  } catch (err) {
    done(err, false);
  }
});

// JWT strategy - extract the JWT from the request header, decode and verify
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY
};

const jwtLogin = new Strategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);

    return user ? done(null, user) : done(null, false);
  } catch (err) {
    return done(err, false);
  }
});

passport.use(localLogin);
passport.use(jwtLogin);
