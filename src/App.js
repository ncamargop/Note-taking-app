import React, { useState } from 'react';
import TodoList from './components/TodoList';
import Dashboard from './components/Dashboard'; // New dashboard component

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [showDashboard, setShowDashboard] = useState(false); // State to toggle between views

  const handleAddTodo = () => {
    if (!newTodo) return;

    const newTodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative">
      {/* Header only shows when we're NOT on the Dashboard */}
      {!showDashboard && (
        <>
          <h1 className="text-4xl font-bold text-white-400 mb-6">To-Do List</h1>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="p-2 rounded-lg border-2 border-gray-300 bg-black text-white"
              placeholder="Add a new task"
            />
            <button
              onClick={handleAddTodo}
              className="bg-green-800 text-white p-2 rounded-lg hover:bg-green-900"
            >
              Add Task
            </button>
          </div>
          <TodoList
            todos={todos}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onRename={handleRename} // Passing handleRename to TodoList
          />
        </>
      )}

      {/* Dashboard content */}
      {showDashboard && <Dashboard />}

      {/* Arrow button to switch between Todo list and Dashboard */}
      <div
        className={`absolute ${showDashboard ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2`}
      >
        <button onClick={toggleView} className="p-2 bg-gray-700 rounded-full">
          <span className="text-xl">{showDashboard ? '←' : '→'}</span> {/* Dynamic arrow */}
        </button>
      </div>
    </div>
  );
}

export default App;
