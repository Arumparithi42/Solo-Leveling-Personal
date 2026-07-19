// Presentational todo row. Completion state comes from the server via
// props — the "Edit"/"Remove" button swaps to "Remove" once a todo is
// marked complete, matching the original UX.
function Todo({ id, title, description, completed, onToggle, onEdit, onRemove }) {
  return (
    <div className="todo">
      <h4>{title}</h4>
      <p>{description}</p>
      <button
        style={{ backgroundColor: completed ? "lightGreen" : "red" }}
        onClick={() => onToggle(id)}
      >
        {completed ? "Completed" : "Done?"}
      </button>
      <button
        style={{ backgroundColor: "red" }}
        onClick={() => (completed ? onRemove(id) : onEdit(id))}
      >
        {completed ? "Remove" : "Edit"}
      </button>
    </div>
  );
}

export default Todo;
