const express = require('express');
const path = require('path');

// Import .env vars here - check for NODE_ENV when importing
if (process.env.NODE_ENV !== 'test') {
  require('dotenv').config({ silent: true });
}

const routes = require('./routes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));

routes(app);

app.use((err, req, res, next) => {
  if (err.stack) {
    console.error(err.stack);
  }
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

module.exports = app;
