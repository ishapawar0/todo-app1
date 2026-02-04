const express = require("express");
const Todo = require("../models/Todo");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create Todo
router.post("/", auth, async (req, res) => {
  const todo = new Todo({ ...req.body, userId: req.userId });
  await todo.save();
  res.json(todo);
});

// Get Todos
router.get("/", auth, async (req, res) => {
  const todos = await Todo.find({ userId: req.userId });
  res.json(todos);
});

// Update Todo
router.put("/:id", auth, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(todo);
});

// Delete Todo
router.delete("/:id", auth, async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Todo deleted" });
});

module.exports = router;
