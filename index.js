const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config({ silent: true });

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(8080, () => console.log('Express server listening on port 8080...'));
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/user/create', async (req, res, next) => {
  try {
    const newUser = new User();
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    await newUser.save();
    res.json({ success: true, email: newUser.email });
  } catch (err) {
    next(err);
  }
});

app.post('/user/login', async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (!existingUser) {
    req.err = 'auth';
    return next({ error: 'User does not exist' });
  }

  existingUser.comparePassword(req.body.password, function (err, isMatch) {
    if (err) {
      return next(err);
    }

    if (!isMatch) {
      req.err = 'auth';
      return next({ error: 'Incorrect password' });
    }

    res.json({ login: true });
  });

});

app.use((err, req, res, next) => {
  console.error(err, err.stack);
  next(err);
});

// Authentication error handler
app.use((err, req, res, next) => {
  if (req.err = 'auth') {
    res.status(401).send('Unauthorized');
  } else {
    next(err);
  }
});

// Catch-all error handler
app.use((err, req, res, next) => {
  res.status(500).send('Internal Server Error');
});
