// GET /api/todo
// Returns just the todoList array
const getTodos = async (req, res) => {
  try {
    res.status(200).json(req.currentUser.todoList);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch todos", error: error.message });
  }
};

// POST /api/todo
// Body: { title, description }
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const user = req.currentUser;
    user.todoList.push({ title, description: description || "", completed: false });
    await user.save();

    res.status(201).json(user.todoList);
  } catch (error) {
    res.status(500).json({ message: "Failed to create todo", error: error.message });
  }
};

// PUT /api/todo/:id
// Body: { title, description } — updates the text fields of a todo
const updateTodo = async (req, res) => {
  try {
    const user = req.currentUser;
    const todo = user.todoList.id(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const { title, description } = req.body;
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;

    await user.save();
    res.status(200).json(user.todoList);
  } catch (error) {
    res.status(500).json({ message: "Failed to update todo", error: error.message });
  }
};

// DELETE /api/todo/:id
const deleteTodo = async (req, res) => {
  try {
    const user = req.currentUser;
    const todo = user.todoList.id(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.deleteOne(); // removes the subdocument from the array
    await user.save();

    res.status(200).json(user.todoList);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete todo", error: error.message });
  }
};

// PUT /api/todo/toggle/:id
// Flips the completed flag on a single todo
const toggleTodo = async (req, res) => {
  try {
    const user = req.currentUser;
    const todo = user.todoList.id(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.completed = !todo.completed;
    await user.save();

    res.status(200).json(user.todoList);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle todo", error: error.message });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo, toggleTodo };
