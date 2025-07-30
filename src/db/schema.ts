import { relations } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";
import { serial, integer, text, boolean, pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  pwd: text("pwd").notNull()
});

export const todo = pgTable("todo", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
  userId: integer("user_id").notNull().references(() => user.id, {
    onDelete: "cascade",
    onUpdate: "cascade"
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const todoRelations = relations(todo, ({ one }) => ({
  user: one(user,{ fields: [todo.userId],references: [user.id] }),
}));

export const userRelations = relations(user, ({ many }) => ({
  todo: many(todo),
}));