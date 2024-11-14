import React from "react";

// TODO: Move items dragging, more configs.
function TodoItem({ todo, onDelete, onToggle }) {
  return (
    <div className="flex items-center justify-between bg-black-800 text-white p-4 my-2 rounded-lg shadow-lg">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="mr-4"
        />
        <span
          className={`text-lg ${
            todo.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-100"
      >
        X
      </button>
    </div>
  );
}

export default TodoItem;
