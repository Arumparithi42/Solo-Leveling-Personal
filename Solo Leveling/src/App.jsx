import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import Home from "./Home";
import TodoList from "./TodoList";

function App() {
  return (
    <BrowserRouter>

      <nav className="navbar">
        <h2>My App</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/todo">Todo</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<TodoList />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;