const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    const server = app.listen(process.env.PORT || 8080, () => {
      const { address, port } = server.address();
      console.log(`Express server listening on https://${address}:${port}`)
    });
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
