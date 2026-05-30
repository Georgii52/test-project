import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import {
  text,
  integer,
  boolean,
  timestamp,
  pgTable,
} from "drizzle-orm/pg-core";

export const rolesTable = pgTable("roles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Role = typeof rolesTable.$inferSelect;

export const usersTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  role: text("role")
    .references(() => rolesTable.name)
    .notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof usersTable.$inferSelect;

export const tasksTable = pgTable("tasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  doneAt: timestamp("done_at"),
  workType: text("work_type")
    .references(() => defaultWorksTable.name)
    .notNull(),
  workAmount: integer("work_amount").notNull(),
  workAmountUnit: text("work_amount_unit").notNull(),
  executor: text("executor_id")
    .references(() => usersTable.id)
    .notNull(),
  status: text("status").notNull().default("active"),
});

export type Task = typeof tasksTable.$inferSelect;

export const defaultWorksTable = pgTable("defaultWorks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type DefaultWork = typeof defaultWorksTable.$inferSelect;

export const rolesRelations = relations(rolesTable, ({ many }) => ({
  users: many(usersTable),
}));

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  role: one(rolesTable, {
    fields: [usersTable.role],
    references: [rolesTable.name],
  }),
  tasks: many(tasksTable),
}));

export const tasksRelations = relations(tasksTable, ({ one }) => ({
  executor: one(usersTable, {
    fields: [tasksTable.executor],
    references: [usersTable.id],
  }),
  workType: one(defaultWorksTable, {
    fields: [tasksTable.workType],
    references: [defaultWorksTable.name],
  }),
}));
