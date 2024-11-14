import React, { useState } from "react";
import { MenuIcon } from "@heroicons/react/solid";

function TodoList({ todos, onDelete, onToggle, onRename }) {
  const [isMenuVisible, setIsMenuVisible] = useState(null);
  const [taskToRename, setTaskToRename] = useState("");
  const [newTaskName, setNewTaskName] = useState("");

  const handleRename = (id) => {
    if (newTaskName.trim() === "") return;
    onRename(id, newTaskName); // Call the onRename function passed as a prop
    setNewTaskName("");
    setTaskToRename(""); // Close rename input after saving
  };

  return (
    <div>
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between bg-gray-800 text-white p-2 rounded-lg my-2 shadow-md"
        >
          {/* Menu button */}
          <div
            className="relative"
            onClick={() =>
              setIsMenuVisible(isMenuVisible === todo.id ? null : todo.id)
            }
          >
            <button className="p-2">
              <MenuIcon className="h-6 w-6 text-white" /> {/* Icon here */}
            </button>

            {/* Dropdown Menu */}
            {isMenuVisible === todo.id && (
              <div className="absolute left-0 bg-gray-700 p-2 rounded-lg mt-2">
                <div
                  className="cursor-pointer text-white mb-2"
                  onClick={() => {
                    setTaskToRename(todo.id);
                    setNewTaskName(todo.text);
                  }}
                >
                  Rename
                </div>
                <div
                  className="cursor-pointer text-red-500"
                  onClick={() => onDelete(todo.id)}
                >
                  Delete
                </div>
              </div>
            )}
          </div>

          {/* Task text and checkbox */}
          {taskToRename === todo.id ? (
            <div className="flex items-center">
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                onBlur={() => handleRename(todo.id)}
                className="bg-transparent text-white border-b-2 border-gray-400 mr-2"
              />
              <button
                onClick={() => handleRename(todo.id)}
                className="text-white"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                className="mr-4"
              />
              <span className={todo.completed ? "line-through" : ""}>
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
