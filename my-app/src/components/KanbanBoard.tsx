"use client";

import { useState, useEffect, DragEvent } from "react";
import TodoCard from "./TodoCard";

export type TodoStatus = "todo" | "in_progress" | "completed";

export type Todo = {
  id: string;
  text: string;
  status: TodoStatus;
};

type Column = {
  id: TodoStatus;
  title: string;
  color: string;
};

const columns: Column[] = [
  { id: "todo", title: "未着手", color: "var(--accent-cyan)" },
  { id: "in_progress", title: "進行中", color: "var(--accent-purple)" },
  { id: "completed", title: "完了", color: "var(--accent-pink)" },
];

const STORAGE_KEY = "kanban-todos";

export default function KanbanBoard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<TodoStatus | null>(null);

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
      status: "todo",
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, todoId: string) => {
    e.dataTransfer.setData("todoId", todoId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, columnId: TodoStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, newStatus: TodoStatus) => {
    e.preventDefault();
    const todoId = e.dataTransfer.getData("todoId");

    setTodos(
      todos.map((todo) =>
        todo.id === todoId ? { ...todo, status: newStatus } : todo
      )
    );
    setDragOverColumn(null);
  };

  const getTodosByStatus = (status: TodoStatus) =>
    todos.filter((todo) => todo.status === status);

  if (!isLoaded) {
    return (
      <div className="kanban-container">
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-2 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="kanban-container">
      {/* Header */}
      <div className="kanban-header">
        <h1 className="text-4xl font-bold gradient-text tracking-tight">
          Kanban Board
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          ドラッグ＆ドロップでタスクを移動
        </p>
      </div>

      {/* Input form */}
      <div className="kanban-input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="新しいタスクを入力..."
          className="neon-input flex-1"
        />
        <button onClick={addTodo} className="neon-button whitespace-nowrap">
          追加
        </button>
      </div>

      {/* Kanban columns */}
      <div className="kanban-columns">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`kanban-column ${
              dragOverColumn === column.id ? "drag-over" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="kanban-column-header">
              <span
                className="kanban-column-indicator"
                style={{ backgroundColor: column.color }}
              />
              <h2 className="kanban-column-title">{column.title}</h2>
              <span className="kanban-column-count">
                {getTodosByStatus(column.id).length}
              </span>
            </div>

            <div className="kanban-column-content">
              {getTodosByStatus(column.id).map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onDelete={deleteTodo}
                  onDragStart={handleDragStart}
                />
              ))}

              {getTodosByStatus(column.id).length === 0 && (
                <div className="kanban-empty">
                  タスクがありません
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
