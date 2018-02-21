const jwt = require('jwt-simple');
const User = require('../models/User');

function encodeJwt(user) {
  const timestamp = (new Date()).getTime();

  return jwt.encode({
    sub: user._id,
    iat: timestamp
  }, process.env.JWT_SECRET_KEY);
}

module.exports = {
  async signup(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!(email && password)) {
        return next({ status: 422, message: 'E-mail and password are required!' });
      }

      const existingUser = User.findOne({ email });

      if (existingUser) {
        return next({ status: 422, message: 'E-mail address already in use' });
      }

      const newUser = new User({ email, password });

      await newUser.save();

      res.status(201).json({ success: true, token: encodeJwt(newUser) });
    } catch(err) {
      next(err);
    }
  },
  async signin(req, res, next) {
    res.status(200).json({ token: encodeJwt(req.user) });
  },
  async find(req, res, next) {
    res.status(200).json(req.user);
  }
};
