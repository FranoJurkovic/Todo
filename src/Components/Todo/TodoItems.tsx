import React from 'react';
import './TodoItems.css';

interface TodoProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
    category: string;
  };
  onDelete: () => void;
  onToggleComplete: () => void;
}

export const TodoItem: React.FC<TodoProps> = ({ todo, onDelete, onToggleComplete }) => {
  return (
    <li className={todo.completed ? 'completed' : ''}>
      <div onClick={onToggleComplete} className="todo-text">
        {todo.text} ({todo.category})
      </div>
      <button className="delete" onClick={onDelete}>Obriši</button>
    </li>
  );
};