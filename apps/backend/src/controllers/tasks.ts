import { Hono } from "hono";
import { z } from "zod";
import { createTaskSchema, updateTaskSchema } from "@repo/shared";
import * as tasksService from "../services/tasks.service";

const tasks = new Hono();

tasks.get("/", async (c) => {
  const page = Number(c.req.query("page") ?? 1);
  const pageSize = Number(c.req.query("pageSize") ?? 10);
  const date = String(c.req.query("date") ?? "");
  const { data, total } = await tasksService.getTasks(page, pageSize, date);
  return c.json({ data, totalPages: Math.ceil(total / pageSize) });
});

tasks.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: z.flattenError(parsed.error).fieldErrors }, 400);
  }
  const task = await tasksService.createTask(parsed.data);
  return c.json(task, 201);
});

tasks.patch("/:id/toggle", async (c) => {
  const id = c.req.param("id");
  const task = await tasksService.toggleTask(id);
  return c.json(task);
});

tasks.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: z.flattenError(parsed.error).fieldErrors }, 400);
  }
  const task = await tasksService.updateTask(id, parsed.data);
  return c.json(task);
});

tasks.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await tasksService.deleteTask(id);
  return c.json(true);
});

export default tasks;
