"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db/drizzle";
import { user } from "@/db/schema";

export const getUsers = async () => {
  const data = await getDb().select().from(user);
  return data;
};


export const deleteUser = async (id: number) => {
  await getDb().delete(user).where(eq(user.id, id));
  
};

export const editUser = async (id: number, username: string, email: string) => {
  await getDb()
    .update(user)
    .set({
      username: username,
      email: email,
    })
    .where(eq(user.id, id));
  
};