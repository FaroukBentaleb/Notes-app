// src/app/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTodos } from "@/actions/todoAction";
import Todos from "@/components/todos";

export default async function HomePage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('currentUser')?.value;

  if (!userCookie) {
    redirect("/login");
  }

  let todos = [];
  let username = "User";
  
  try {
    const userData = JSON.parse(decodeURIComponent(userCookie));
    username = userData.username || "User";
    todos = await getTodos();
  } catch (error) {
    console.error("Error:", error);
    const cooki = await cookies();
    cooki.delete('currentUser');
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{username} s Todos</h1>
          <a 
            href="/logout" 
            className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <Todos initialTodos={todos} />
      </main>
    </div>
  );
}