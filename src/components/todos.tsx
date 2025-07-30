"use client";
import { useState, useEffect } from "react";
import { TodoType } from "@/types/todoType";
import Todo from "./todo";
import AddTodo from "./addTodo";
import { addTodo, deleteTodo, editTodo, toggleTodo, getTodos } from "@/actions/todoAction";
import { useUser } from "@/context/user-context";

export default function Todos({ initialTodos }: { initialTodos: TodoType[] }) {
  const [todoItems, setTodoItems] = useState<TodoType[]>(initialTodos);
  const [loading, setLoading] = useState(false);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (user) {
      const fetchTodos = async () => {
        try {
          const todos = await getTodos();
          setTodoItems(todos);
        } catch (error) {
          console.error("Failed to fetch todos:", error);
        }
      };
      fetchTodos();
    }
  }, [user]);

  if (userLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto mt-8">
        <h2 className="text-lg font-semibold mb-4">Please login</h2>
        <p className="text-gray-600 mb-4">You need to login to view your todos.</p>
        <a 
          href="/login" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </a>
      </div>
    );
  }

  const createTodo = async (text: string) => {
    setLoading(true);
    try {
      const newTodo = await addTodo(text);
      setTodoItems(prev => [...prev, newTodo]);
    } finally {
      setLoading(false);
    }
  };

  const changeTodoText = async (id: number, text: string) => {
    setLoading(true);
    try {
      await editTodo(id, text);
      setTodoItems(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    } finally {
      setLoading(false);
    }
  };

  const toggleIsTodoDone = async (id: number) => {
    setLoading(true);
    try {
      await toggleTodo(id);
      setTodoItems(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    } finally {
      setLoading(false);
    }
  };

  const deleteTodoItem = async (id: number) => {
    setLoading(true);
    try {
      await deleteTodo(id);
      setTodoItems(prev => prev.filter(t => t.id !== id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {todoItems.map(todo => (
              <Todo
                key={todo.id}
                todo={todo}
                changeTodoText={changeTodoText}
                toggleIsTodoDone={toggleIsTodoDone}
                deleteTodoItem={deleteTodoItem}
              />
            ))}
          </div>
          <AddTodo createTodo={createTodo} />
        </>
      )}
    </div>
  );
}