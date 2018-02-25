const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(8080, () => console.log('Express server listening on port 8080...'));
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
