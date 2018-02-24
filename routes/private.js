const express = require('express');
const passport = require('passport');
const UserController = require('../controllers/UserController');
const TodoController = require('../controllers/TodoController');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(jwtAuth);
router.get('/user', UserController.find);

// To-Dos
router.get('/todos', TodoController.list);
router.post('/todos', TodoController.create);
router.get('/todos/:id', TodoController.authenticate, TodoController.find);
router.put('/todos/:id/edit', TodoController.authenticate, TodoController.update);
router.delete('/todos/:id/delete', TodoController.authenticate, TodoController.delete);

module.exports = router;
