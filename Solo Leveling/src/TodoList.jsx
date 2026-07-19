import { useState, useEffect } from "react";
import { api } from "./api";
import Todo from "./Todo";

function TodoList() {
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state — purely local UI state, not the source of truth for todos
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    api
      .getTodos()
      .then(setTodoList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function add() {
    if (title.trim() === "") return;

    try {
      let updatedList;
      if (!editId) {
        updatedList = await api.createTodo(title, description);
      } else {
        updatedList = await api.updateTodo(editId, title, description);
        setEditId(null);
      }
      setTodoList(updatedList);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  }

  function edit(id) {
    const todo = todoList.find((t) => t._id === id);
    if (!todo) return;
    setTitle(todo.title);
    setDescription(todo.description);
    setEditId(id);
  }

  async function remove(id) {
    try {
      const updatedList = await api.deleteTodo(id);
      setTodoList(updatedList);
      if (editId === id) {
        setEditId(null);
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggle(id) {
    try {
      const updatedList = await api.toggleTodo(id);
      setTodoList(updatedList);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="progress">Loading...</p>;

  return (
    <div className="todoListContainer">
      <h2>ToDos</h2>

      {error && <p className="progress">{error}</p>}

      {todoList.map((todo) => (
        <Todo
          key={todo._id}
          id={todo._id}
          title={todo.title}
          description={todo.description}
          completed={todo.completed}
          onToggle={toggle}
          onEdit={edit}
          onRemove={remove}
        />
      ))}

      <label htmlFor="todoTitle">Title</label>
      <input
        id="todoTitle"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label htmlFor="todoDescription">Description</label>
      <input
        id="todoDescription"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={add}>{!editId ? "Add" : "Update"}</button>
    </div>
  );
}

export default TodoList;
