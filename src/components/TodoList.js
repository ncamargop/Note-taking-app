import React, { useState } from "react";
import { MenuIcon } from "@heroicons/react/solid";
import "./TodoList.css";

function TodoList({ todos, onDelete, onToggle, onRename }) {
  const [isMenuVisible, setIsMenuVisible] = useState(null);
  const [taskToRename, setTaskToRename] = useState("");
  const [newTaskName, setNewTaskName] = useState("");

  const handleRename = (id) => {
    if (newTaskName.trim() === "") return;
    onRename(id, newTaskName);
    setNewTaskName("");
    setTaskToRename("");
  };

  return (
    <div className="todo-container">
      {todos.map((todo) => (
        <div key={todo.id} className="todo-item-container">
          {/* Menu button */}
          <div
            className="menu-container"
            onClick={() =>
              setIsMenuVisible(isMenuVisible === todo.id ? null : todo.id)
            }
          >
            <button className="menu-button">
              <MenuIcon className="menu-icon" />
            </button>

            {/* Dropdown Menu */}
            {isMenuVisible === todo.id && (
              <div className="dropdown-menu">
                <div
                  className="menu-option rename-option"
                  onClick={() => {
                    setTaskToRename(todo.id);
                    setNewTaskName(todo.text);
                  }}
                >
                  Rename
                </div>
                <div
                  className="menu-option delete-option"
                  onClick={() => onDelete(todo.id)}
                >
                  Delete
                </div>
              </div>
            )}
          </div>

          {/* Task text and checkbox */}
          {taskToRename === todo.id ? (
            <div className="rename-container">
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                onBlur={() => handleRename(todo.id)}
                className="rename-input"
              />
              <button
                onClick={() => handleRename(todo.id)}
                className="save-button"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="task-container">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                className="task-checkbox"
              />
              <span
                className={`task-text ${todo.completed ? "completed" : ""}`}
              >
                {todo.text}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TodoList;
