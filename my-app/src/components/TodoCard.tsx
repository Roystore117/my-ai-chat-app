"use client";

import { DragEvent, useState } from "react";
import { Todo } from "./KanbanBoard";

type TodoCardProps = {
  todo: Todo;
  onDelete: (id: string) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, todoId: string) => void;
};

export default function TodoCard({ todo, onDelete, onDragStart }: TodoCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    onDragStart(e, todo.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`todo-card ${isDragging ? "dragging" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="todo-card-content">
        <span className="todo-card-text">{todo.text}</span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="todo-card-delete"
        aria-label="Delete task"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className="todo-card-drag-handle">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          opacity="0.4"
        >
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </div>
    </div>
  );
}
