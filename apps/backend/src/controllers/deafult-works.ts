import { Hono } from "hono";
import z from "zod";
import { createDefaultWorkSchema } from "@repo/shared";
import * as defaultWorksService from "../services/default-works.service";

const defaultWorks = new Hono();

defaultWorks.get("/", async (c) => {
  const data = await defaultWorksService.getDefaultWorks();
  return c.json({ defaultWorks: data });
});

defaultWorks.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = createDefaultWorkSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: z.flattenError(parsed.error).fieldErrors }, 400);
  }
  try {
    const defaultWork = await defaultWorksService.createDefaultWork(
      parsed.data,
    );
    return c.json(defaultWork, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "ALREADY_EXISTS") {
      return c.json({ error: "Такой тип работы уже существует" }, 409);
    }
    return c.json({ error: "Не удалось создать тип работы" }, 500);
  }
});

export default defaultWorks;
