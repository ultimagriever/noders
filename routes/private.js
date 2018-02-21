const express = require('express');
const passport = require('passport');
const UserController = require('../controllers/UserController');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(jwtAuth);
router.get('/user', UserController.find);

module.exports = router;
