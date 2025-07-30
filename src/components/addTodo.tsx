"use client";
import { useState } from "react";

export default function AddTodo({ createTodo }: { createTodo: (text: string) => Promise<void> }) {
  const [input, setInput] = useState("");

  const handleAdd = async () => {
    if (input.trim()) {
      await createTodo(input);
      setInput("");
    }
  };

  return (
    <div className="flex gap-3 mt-6">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder="Add a new todo..."
      />
      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add
      </button>
    </div>
  );
}