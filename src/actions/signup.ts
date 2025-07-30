// src/actions/signup.ts
"use server";
import { getDb } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { userType } from "@/types/userType";

export async function signupUser(userData: Omit<userType, 'id'>) {
  try {
    // Check if db is initialized
    if (!getDb()) {
      throw new Error("Database connection not established");
    }

    // Check if user already exists
    const [existingUser] = await getDb().select()
      .from(user)
      .where(eq(user.email, userData.email))
      .limit(1);

    if (existingUser) {
      return { success: false, error: "Email already in use" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.pwd, 12);

    // Create new user
    const [newUser] = await getDb().insert(user)
      .values({
        username: userData.username,
        email: userData.email,
        pwd: hashedPassword
      })
      .returning();

    return { 
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    };
  } catch (error) {
    console.error("Signup error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create account" 
    };
  }
}