function TodoTemplate({ id, msg, done, onDone }) {
  return (
    <div className="todoTemplate">
      <p>{msg}</p>
      <button
        style={{ backgroundColor: done ? "lightGreen" : "red" }}
        onClick={() => onDone(id)}
      >
        {done ? "Completed ✅" : "Done?"}
      </button>
    </div>
  );
}

export default TodoTemplate;
