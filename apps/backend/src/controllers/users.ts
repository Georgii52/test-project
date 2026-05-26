import { Hono } from "hono";
import { z } from "zod";
import { createUserSchema } from "@repo/shared";
import * as usersService from "../services/users.service";

const users = new Hono();

users.get("/", async (c) => {
  const data = await usersService.getUsers();
  return c.json({ users: data });
});

users.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: z.flattenError(parsed.error).fieldErrors }, 400);
  }
  const user = await usersService.createUser(parsed.data);
  return c.json(user, 201);
});

export default users;
