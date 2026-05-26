import { asc } from "drizzle-orm";
import { database } from "@/db";
import { rolesTable } from "@/db/schema";
import type { CreateRoleInput } from "@repo/shared";

export async function getRoles() {
  return database.query.rolesTable.findMany({
    orderBy: asc(rolesTable.name),
  });
}

export async function createRole(data: CreateRoleInput) {
  const [role] = await database.insert(rolesTable).values(data).returning();
  return role;
}
