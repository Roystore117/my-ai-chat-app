"use client";

import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "todos";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTodos(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const addTodo = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  if (!isLoaded) {
    return (
      <div className="glass-card w-full max-w-lg p-10">
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-2 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card w-full max-w-lg p-8 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Header */}
      <div className="relative mb-8">
        <h1 className="text-4xl font-bold gradient-text tracking-tight">
          Tasks
        </h1>
        {totalCount > 0 && (
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span style={{ color: "var(--accent-cyan)" }}>{completedCount}</span>
            <span> / {totalCount} completed</span>
          </p>
        )}
      </div>

      {/* Input form */}
      <div className="relative flex gap-3 mb-8">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="neon-input flex-1"
        />
        <button onClick={addTodo} className="neon-button whitespace-nowrap">
          Add Task
        </button>
      </div>

      {/* Todo list */}
      <ul className="space-y-3 relative">
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            index={index}
          />
        ))}
      </ul>

      {/* Empty state */}
      {todos.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <p className="empty-state-text">
            No tasks yet. Add one to get started!
          </p>
        </div>
      )}
    </div>
  );
}
