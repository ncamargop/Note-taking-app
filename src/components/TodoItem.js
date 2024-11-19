import React from "react";
import "./TodoItem.css";

function TodoItem({ todo, onDelete, onToggle }) {
  return (
    <div className="todo-item">
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
        />
        <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
          {todo.text}
        </span>
      </div>
      <button onClick={() => onDelete(todo.id)} className="delete-button">
        X
      </button>
    </div>
  );
}

export default TodoItem;
