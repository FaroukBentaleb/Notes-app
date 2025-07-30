"use client";
import { useState } from "react";
import { TodoType } from "@/types/todoType";

export default function Todo({
  todo,
  changeTodoText,
  toggleIsTodoDone,
  deleteTodoItem
}: {
  todo: TodoType;
  changeTodoText: (id: number, text: string) => Promise<void>;
  toggleIsTodoDone: (id: number) => Promise<void>;
  deleteTodoItem: (id: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  const handleSave = () => {
    changeTodoText(todo.id, text);
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => toggleIsTodoDone(todo.id)}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly={!editing}
        className={`flex-1 px-3 py-2 border rounded ${todo.done ? "line-through text-gray-400" : "text-gray-700"} ${editing ? "border-blue-300" : "border-transparent"}`}
      />
      
      <div className="flex gap-2">
        {editing ? (
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => deleteTodoItem(todo.id)}
          className="px-3 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}