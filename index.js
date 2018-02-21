const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ silent: true });
const routes = require('./routes');

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

routes(app);

app.use((err, req, res, next) => {
  console.error(err, err.stack);
  next(err);
});

// Status-specific error handler
app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).send(err.message);
  } else {
    next(err);
  }
});

// Catch-all error-handler
app.use((err, req, res, next) => {
  res.status(500).send('Internal Server Error');
});
