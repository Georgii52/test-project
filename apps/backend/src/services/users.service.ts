import { asc } from "drizzle-orm";
import { database } from "@/db";
import { usersTable } from "@/db/schema";
import type { CreateUserInput } from "@repo/shared";

export async function getUsers() {
  return database.query.usersTable.findMany({
    orderBy: asc(usersTable.name),
  });
}

export async function createUser(data: CreateUserInput) {
  const [user] = await database.insert(usersTable).values(data).returning();
  return user;
}
