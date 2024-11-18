import React, { useState } from "react";
import TodoList from "./components/TodoList";
import Dashboard from "./components/Dashboard";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import "./index.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);

  const handleAddTodo = () => {
    if (!newTodo) return;

    const newTodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo("");
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleRename = (id, newTaskName) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newTaskName } : todo
      )
    );
  };

  const toggleView = () => {
    setShowDashboard(!showDashboard);
  };

  return (
    <div className="relative min-h-screen">
      {" "}
      {!showDashboard && (
        <>
          <h1 className="header-todolist">To-Do List</h1>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="add-task-input"
            placeholder="Add a new task"
          />
          <button onClick={handleAddTodo} className="add-task-button">
            Add Task
          </button>
          <TodoList
            todos={todos}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onRename={handleRename}
          />
        </>
      )}
      {/* Dashboard content */}
      {showDashboard && <Dashboard />}
      {/* Arrow button to switch between Todo list and Dashboard */}
      <div
        className={`arrow-container ${showDashboard ? "left-4" : "right-4"}`}
      >
        <button onClick={toggleView} className="left-right-buttons">
          <span>
            {showDashboard ? (
              <MdKeyboardArrowLeft size={30} color="white" />
            ) : (
              <MdKeyboardArrowRight size={30} color="white" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

export default App;
