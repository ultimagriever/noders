const express = require('express');
const passport = require('passport');
const UserController = require('../controllers/UserController');

const router = express.Router();

const localAuth = passport.authenticate('local', { session: false });

router.post('/signup', UserController.signup);
router.post('/signin', localAuth, UserController.signin);

module.exports = router;
