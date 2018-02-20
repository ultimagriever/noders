const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config({ silent: true });

const app = express();

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
