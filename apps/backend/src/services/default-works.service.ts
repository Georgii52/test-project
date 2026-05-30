import { asc } from "drizzle-orm";
import { database } from "@/db";
import { defaultWorksTable } from "@/db/schema";
import type { CreateDefautWorkInput } from "@repo/shared";

export async function getDefaultWorks() {
  return database.query.defaultWorksTable.findMany({
    orderBy: asc(defaultWorksTable.name),
  });
}

export async function createDefaultWork(data: CreateDefautWorkInput) {
  try {
    const [defaultWork] = await database
      .insert(defaultWorksTable)
      .values(data)
      .returning();
    return defaultWork;
  } catch (error) {
    if ((error as { cause?: { code?: string } }).cause?.code === "23505") {
      throw new Error("ALREADY_EXISTS");
    }
    throw error;
  }
}
