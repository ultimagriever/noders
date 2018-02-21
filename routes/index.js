require('../services/passport');

const privateRoutes = require('./private');
const publicRoutes = require('./public');

module.exports = app => {
  app.use('/public', publicRoutes);
  app.use('/private', privateRoutes);
};
