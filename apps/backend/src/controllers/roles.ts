import { Hono } from "hono";
import { z } from "zod";
import { createRoleSchema } from "@repo/shared";
import * as rolesService from "../services/roles.service";

const roles = new Hono();

roles.get("/", async (c) => {
  const data = await rolesService.getRoles();
  return c.json({ roles: data });
});

roles.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = createRoleSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: z.flattenError(parsed.error).fieldErrors }, 400);
  }
  const role = await rolesService.createRole(parsed.data);
  return c.json(role, 201);
});

export default roles;
