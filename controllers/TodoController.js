const Todo = require('../models/Todo');

module.exports = {
  async list(req, res, next) {
    try {
      const todos = await Todo.find({ owner: req.user._id });

      res.status(200).json(todos);
    } catch (err) {
      next(err);
    }
  },
  async find(req, res, next) {
   try {
     const todo = await Todo.findById(req.params.id);

     res.status(200).json(todo);
   } catch (err) {
     next(err);
   }
  },
  async create(req, res, next) {
    try {
      const params = Object.assign({}, req.body, { owner: req.user._id });

      const newTodo = await Todo.create(params);

      res.status(201).json(newTodo);
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });

      res.status(200).json(updatedTodo);
    } catch (err) {
      next(err);
    }
  },
  async delete(req, res, next) {
    try {
      await Todo.findByIdAndRemove(req.params.id);

      res.status(200).json({success: true});
    } catch (err) {
      next(err);
    }
  },
  async authenticate(req, res, next) {
    try {
      const todo = await Todo.findOne({ _id: req.params.id, owner: req.user._id });

      if (!todo) {
        return next({ status: 403, message: "Forbidden" });
      }

      next();
    }
  }
};
