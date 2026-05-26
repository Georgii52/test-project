import { and, count, desc, eq, gte, lt, sql } from "drizzle-orm";
import { database } from "@/db";
import { tasksTable } from "@/db/schema";
import type { CreateTaskInput, UpdateTaskInput } from "@repo/shared";

export async function getTasks(page = 1, pageSize = 10, date?: string) {
  let whereClause;

  if (date) {
    const from = new Date(date);
    const to = new Date(date);
    to.setDate(to.getDate() + 1);
    whereClause = and(gte(tasksTable.createdAt, from), lt(tasksTable.createdAt, to));
  }

  const [data, [{ total }]] = await Promise.all([
    database.query.tasksTable.findMany({
      with: { executor: true },
      orderBy: [sql`${tasksTable.status} = 'active' DESC`, desc(tasksTable.createdAt)],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      where: whereClause,
    }),
    database.select({ total: count() }).from(tasksTable).where(whereClause),
  ]);

  return { data, total };
}

export async function createTask(data: CreateTaskInput) {
  const [task] = await database.insert(tasksTable).values(data).returning();
  return task;
}

export async function updateTask(id: string, data: UpdateTaskInput) {
  const task = await database.query.tasksTable.findFirst({
    where: eq(tasksTable.id, id),
  });
  if (!task) throw new Error("Task not found");

  const [updated] = await database
    .update(tasksTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasksTable.id, id))
    .returning();
  return updated;
}

export async function toggleTask(id: string) {
  const task = await database.query.tasksTable.findFirst({
    where: eq(tasksTable.id, id),
  });
  if (!task) throw new Error("Task not found");

  const newStatus = task.status === "active" ? "done" : "active";
  const doneAt = newStatus === "done" ? new Date() : null;

  await database
    .update(tasksTable)
    .set({ status: newStatus, doneAt, updatedAt: new Date() })
    .where(eq(tasksTable.id, id));

  return database.query.tasksTable.findFirst({
    where: eq(tasksTable.id, id),
    with: { executor: true },
  });
}

export async function deleteTask(id: string) {
  const task = await database.query.tasksTable.findFirst({
    where: eq(tasksTable.id, id),
  });
  if (!task) throw new Error("Task not found");

  await database.delete(tasksTable).where(eq(tasksTable.id, id));
}
