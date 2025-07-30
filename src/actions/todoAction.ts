"use server";
import { and, eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { todo } from "@/db/schema";
import { cookies } from 'next/headers';
import { getDb } from "@/db/drizzle";

const getAuthenticatedUser = async () => {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('currentUser')?.value;
    
    if (!userCookie) {
      console.error('No user cookie found');
      throw new Error('Not authenticated - Please login again');
    }

    return JSON.parse(userCookie);
  } catch (error) {
    console.error('Error in getAuthenticatedUser:', error);
    throw error;
  }
};

export const getTodos = async () => {
  try {
    const { id } = await getAuthenticatedUser();
    const db = getDb();
    return await db.select()
      .from(todo)
      .where(eq(todo.userId, id))
      .orderBy(todo.createdAt);
  } catch (error) {
    console.error("Error in getTodos:", error);
    throw error;
  }
};

export const addTodo = async (text: string) => {
  try {
    const { id: userId } = await getAuthenticatedUser();
    const db = getDb();
    
    if (!text.trim()) {
      throw new Error("Todo text cannot be empty");
    }

    const [newTodo] = await db.insert(todo)
      .values({
        text: text.trim(),
        done: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    revalidatePath("/");
    return newTodo;
  } catch (error) {
    console.error("Error in addTodo:", error);
    throw error;
  }
};

export const deleteTodo = async (id: number) => {
  try {
    const { id: userId } = await getAuthenticatedUser();
    const db = getDb();
    
    await db.delete(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));
    
    revalidatePath("/");
  } catch (error) {
    console.error("Error in deleteTodo:", error);
    throw error;
  }
};

export const toggleTodo = async (id: number) => {
  try {
    const { id: userId } = await getAuthenticatedUser();
    const db = getDb();
    
    await db.update(todo)
      .set({ 
        done: not(todo.done), 
        updatedAt: new Date() 
      })
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));
    
    revalidatePath("/");
  } catch (error) {
    console.error("Error in toggleTodo:", error);
    throw error;
  }
};

export const editTodo = async (id: number, text: string) => {
  try {
    const { id: userId } = await getAuthenticatedUser();
    
    if (!text.trim()) {
      throw new Error("Todo text cannot be empty");
    }
    const db = getDb();

    await db.update(todo)
      .set({ 
        text: text.trim(), 
        updatedAt: new Date() 
      })
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));
    
    revalidatePath("/");
  } catch (error) {
    console.error("Error in editTodo:", error);
    throw error;
  }
};