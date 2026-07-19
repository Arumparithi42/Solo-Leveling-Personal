const express = require("express");
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} = require("../controllers/todoController");

// Mounted at /api/todo in server.js
router.get("/", getTodos);
router.post("/", createTodo);
router.put("/toggle/:id", toggleTodo); // must come before /:id so it isn't swallowed by it
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
