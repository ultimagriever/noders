const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.testing'),
  silent: true
});

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const collections = Object.keys(mongoose.connection.collections);

  collections.forEach(async collection => {
    try {
      await mongoose.connection.db.dropCollection(collection);
    } catch (err) {
      // do nothing - collection might not exist because database is already empty
    }
  });
});
