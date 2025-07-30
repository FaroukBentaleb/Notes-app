// src/actions/login.ts
"use server";
import { getDb } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

type LoginResult = 
  | { success: true; user: { id: number; username: string; email: string } }
  | { success: false; error: string };
// src/actions/login.ts
export async function loginUser(email: string, password: string): Promise<LoginResult> {
  try {
    const db = getDb();
    if (!db) throw new Error("Database connection not established");

    const [userData] = await db.select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!userData) return { success: false, error: "Invalid email or password" };

    const passwordMatch = await bcrypt.compare(password, userData.pwd);
    if (!passwordMatch) return { success: false, error: "Invalid email or password" };

    // Return the minimal needed user data
    return { 
      success: true,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to login" 
    };
  }
}